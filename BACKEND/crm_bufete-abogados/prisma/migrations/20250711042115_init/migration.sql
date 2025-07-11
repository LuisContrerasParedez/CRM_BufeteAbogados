/*
  Warnings:

  - You are about to drop the column `CantMeses` on the `pago` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pago` DROP COLUMN `CantMeses`,
    ADD COLUMN `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `fechaPago` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
