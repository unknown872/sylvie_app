/*
  Warnings:

  - You are about to drop the column `dateExpedition` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `dateLivraison` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dateExpedition",
DROP COLUMN "dateLivraison",
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3);
