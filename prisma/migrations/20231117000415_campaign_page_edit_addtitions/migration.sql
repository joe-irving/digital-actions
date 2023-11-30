-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'public',
ALTER COLUMN "icon" DROP NOT NULL;
