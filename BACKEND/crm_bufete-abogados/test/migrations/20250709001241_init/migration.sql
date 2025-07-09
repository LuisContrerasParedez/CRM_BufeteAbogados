/*
  Warnings:

  - Added the required column `apellido` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `apellido` VARCHAR(191) NOT NULL,
    ADD COLUMN `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefono` INTEGER NOT NULL;
