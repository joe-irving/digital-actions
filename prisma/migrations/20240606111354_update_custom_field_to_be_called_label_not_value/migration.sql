/*
  Warnings:

  - You are about to drop the column `value` on the `CustomField` table. All the data in the column will be lost.
  - Added the required column `label` to the `CustomField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomField" DROP COLUMN "value",
ADD COLUMN     "label" TEXT NOT NULL;
