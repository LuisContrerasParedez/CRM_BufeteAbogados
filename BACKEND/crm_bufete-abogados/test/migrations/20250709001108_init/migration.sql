/*
  Warnings:

  - You are about to drop the column `apellido` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `correo` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_registro` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `cliente` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Cliente_correo_key` ON `cliente`;

-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `apellido`,
    DROP COLUMN `correo`,
    DROP COLUMN `direccion`,
    DROP COLUMN `fecha_registro`,
    DROP COLUMN `nombre`,
    DROP COLUMN `telefono`;
