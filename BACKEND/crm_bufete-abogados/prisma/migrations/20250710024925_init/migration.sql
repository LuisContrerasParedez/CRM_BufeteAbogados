-- CreateTable
CREATE TABLE `Cuenta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroEscritura` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PRESTAMO', 'RENTA') NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `interes` DECIMAL(5, 2) NULL,
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuentaId` INTEGER NOT NULL,
    `tipo` ENUM('INTERES', 'ABONO_CAPITAL', 'PAGO_RENTA') NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `saldoPendiente` DECIMAL(10, 2) NOT NULL,
    `rentaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Renta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuentaId` INTEGER NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL,
    `montoMensual` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `Renta_cuentaId_key`(`cuentaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cuenta` ADD CONSTRAINT `Cuenta_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `Cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_rentaId_fkey` FOREIGN KEY (`rentaId`) REFERENCES `Renta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Renta` ADD CONSTRAINT `Renta_cuentaId_fkey` FOREIGN KEY (`cuentaId`) REFERENCES `Cuenta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
