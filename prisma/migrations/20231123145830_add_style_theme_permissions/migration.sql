-- CreateTable
CREATE TABLE "StyleThemePermission" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "styleThemeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "StyleThemePermission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StyleThemePermission" ADD CONSTRAINT "StyleThemePermission_styleThemeId_fkey" FOREIGN KEY ("styleThemeId") REFERENCES "StyleTheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleThemePermission" ADD CONSTRAINT "StyleThemePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
