-- CreateTable
CREATE TABLE "VerifiedActionNetworkPetition" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpoint" TEXT NOT NULL,
    "actionNetworkCredentialId" INTEGER NOT NULL,
    "petitionCampaignId" INTEGER NOT NULL,

    CONSTRAINT "VerifiedActionNetworkPetition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerifiedActionNetworkPetition" ADD CONSTRAINT "VerifiedActionNetworkPetition_actionNetworkCredentialId_fkey" FOREIGN KEY ("actionNetworkCredentialId") REFERENCES "ActionNetworkCredential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedActionNetworkPetition" ADD CONSTRAINT "VerifiedActionNetworkPetition_petitionCampaignId_fkey" FOREIGN KEY ("petitionCampaignId") REFERENCES "PetitionCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
