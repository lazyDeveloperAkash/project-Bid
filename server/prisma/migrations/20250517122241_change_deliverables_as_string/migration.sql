/*
  Warnings:

  - You are about to drop the `Deliverable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deliverables" TEXT[];

-- DropTable
DROP TABLE "Deliverable";
