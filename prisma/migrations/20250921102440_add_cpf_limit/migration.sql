/*
  Warnings:

  - You are about to alter the column `cpf` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(11)`.

*/
-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "cpf" SET DATA TYPE CHAR(11);
