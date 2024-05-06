import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
// import { sendLoginEmail } from '../utils/login'
import { sendLoginEmail } from '../utils/login'
import { permissionTypeList, permissionsSelect } from './permissions'
// import { permissionsSelect } from './permissions'

export const petitionPermission = router({
  me: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in'
      })
    }
    return await ctx.prisma.userPetitionPermissions.findMany({
      where: {
        petitionId: input.id,
        userId: ctx.user.id
      },
      select: permissionsSelect
    })
  }),
  list: publicProcedure.input(z.object({
    id: z.number().int()
  })).query(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You need to be logged in'
      })
    }
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        id: input.id,
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user.id,
                type: {
                  in: ['owner', 'admin']
                }
              }
            }
          },
          {
            petitionCampaign: {
              permissions: {
                some: {
                  userId: ctx.user.id,
                  type: {
                    in: ['owner', 'admin']
                  }
                }
              }
            }
          }
        ]
      },
      select: {
        permissions: {
          select: permissionsSelect
        }
      }
    })
    if (!petition) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find a petition with that id on your account'
      })
    }
    return petition.permissions
  }),
  update: publicProcedure.input(z.object({
    id: z.number().int(),
    type: z.enum(['admin', 'read', 'write'])
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in for updating permissions'
      })
    }
    // Check this is an expected type
    const neededTypesList = permissionTypeList.filter(definition => definition.type === input.type)
    if (!neededTypesList.length) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not find type definition'
      })
    }
    // Get the allowed permission of the user that is making this request
    const neededTypes = neededTypesList[0].allowed
    // Lookup to see if they have approprate permissions
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        permissions: {
          some: {
            id: input.id
          }
        },
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user.id,
                type: {
                  in: neededTypes
                }
              }
            }
          },
          {
            petitionCampaign: {
              permissions: {
                some: {
                  userId: ctx.user.id,
                  type: {
                    in: neededTypes
                  }
                }
              }
            }
          }
        ]
      }
    })

    if (!petition) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `This user does not have permission to add type "${input.type}"`
      })
    }

    return await ctx.prisma.userPetitionPermissions.update({
      where: {
        id: input.id
      },
      data: {
        type: input.type
      },
      select: permissionsSelect
    })
  }),
  add: publicProcedure.input(z.object({
    petitionId: z.number().int(),
    email: z.string().regex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, {
      message: 'That is not an email in the creatorEmail field.'
    }),
    type: z.enum(['admin', 'read', 'write'])
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in for create permissions'
      })
    }

    // Check if type acceptable for user to add
    const allowedTypes = permissionTypeList.filter(p => p.type === input.type)
    if (!allowedTypes.length) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not find record of that permission type'
      })
    }

    const existingPermissions = await ctx.prisma.userPetitionPermissions.findMany({
      where: {
        petitionId: input.petitionId,
        user: {
          email: input.email
        }
      }
    })
    if (existingPermissions.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot add permission that already exists'
      })
    }
    // check if you can get the petition on the users permission type (test for if permission's are okay)
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        id: input.petitionId,
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user.id,
                type: {
                  in: allowedTypes[0].allowed
                }
              }
            }
          },
          {
            petitionCampaign: {
              permissions: {
                some: {
                  userId: ctx.user.id,
                  type: {
                    in: allowedTypes[0].allowed
                  }
                }
              }
            }
          }
        ]
      }
    })

    if (!petition) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `To add a "${input.type}" permission you need a permission in this list: ${allowedTypes[0].allowed}`
      })
    }

    // Start creating...
    // Lookup user with email
    let userId: string | undefined
    let userCreated = false
    const userToAdd = await ctx.prisma.user.findFirst({
      where: {
        email: input.email
      }
    })
    userId = userToAdd?.id
    if (!userId) {
      const newUser = await ctx.prisma.user.create({
        data: {
          email: input.email
        }
      })
      if (!newUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Issue creating a new user for ${input.email}`
        })
      }
      userCreated = true
      userId = newUser?.id
    }
    // Create permission
    const newPermission = await ctx.prisma.userPetitionPermissions.create({
      data: {
        userId,
        petitionId: input.petitionId,
        type: input.type
      },
      select: permissionsSelect
    })
    if (userCreated) {
      await sendLoginEmail(input.email, `/petition/${input.petitionId}`)
    }
    return newPermission
  }),
  delete: publicProcedure.input(z.object({
    id: z.number().int()
  })).mutation(async ({ ctx, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not logged in for removing permissions'
      })
    }
    const petition = await ctx.prisma.petition.findFirst({
      where: {
        permissions: {
          some: {
            id: input.id
          }
        },
        OR: [
          {
            permissions: {
              some: {
                userId: ctx.user.id,
                type: {
                  in: ['admin', 'owner']
                }
              }
            }
          },
          {
            petitionCampaign: {
              permissions: {
                some: {
                  userId: ctx.user.id,
                  type: {
                    in: ['admin', 'owner']
                  }
                }
              }
            }
          }
        ]
      }
    })

    if (!petition) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You don\'t have admin or owner permissions for this petition or its parent campaign, so cannot delete the associated permission'
      })
    }

    return await ctx.prisma.userPetitionPermissions.delete({
      where: {
        id: input.id
      },
      select: permissionsSelect
    })
  })
})
