/*
  Warnings:

  - You are about to drop the column `businessNo` on the `Business` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Business_businessNo_key";

-- AlterTable
ALTER TABLE "public"."Business" DROP COLUMN "businessNo",
ADD COLUMN     "accountNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_accountNumber_key" ON "public"."Business"("accountNumber");
