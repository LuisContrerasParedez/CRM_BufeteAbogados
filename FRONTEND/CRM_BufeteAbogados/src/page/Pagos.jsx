import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPagos, createPago } from '../store/pagos/thunks'
import { fetchCuentas } from '../store/cuentas/thunks'
import { rentasThunks } from '../store/Renta'
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  VStack,
  Divider,
  Input,
  Stack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FiPlus } from 'react-icons/fi'

export default function Pagos() {
  const dispatch = useDispatch()
  const toast = useToast()

  const [form, setForm] = useState({
    cuentaId: '',
    tipo: '',
    monto: '',
    mesInicio: '',
    mesFin: '',
    rentaId: '',
    CantMeses: '',
    fechaPago: ''
  })
  const [menuFilter, setMenuFilter] = useState('')

  // Carga inicial
  useEffect(() => {
    dispatch(fetchPagos())
    dispatch(fetchCuentas())
    dispatch(rentasThunks.fetchRentas())
  }, [dispatch])

  const { items: pagos } = useSelector(s => s.pagos)
  const { items: cuentas } = useSelector(s => s.cuentas)
  const { items: rentas } = useSelector(s => s.rentas)

  // Selección de cuenta actual
  const cuenta = useMemo(
    () => cuentas.find(c => c.id === Number(form.cuentaId)),
    [cuentas, form.cuentaId]
  )

  // Pagos de esta cuenta
  const pagosCuenta = useMemo(
    () => pagos.filter(p => p.cuentaId === Number(form.cuentaId)),
    [pagos, form.cuentaId]
  )

  // Calcular último saldo para ABONO_CAPITAL
  const ultimoSaldo = useMemo(() => {
    if (!cuenta) return 0
    if (pagosCuenta.length === 0) return Number(cuenta.monto)
    const masReciente = pagosCuenta
      .filter(p => p.tipo === 'ABONO_CAPITAL')
      .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))[0]
    return masReciente
      ? Number(masReciente.saldoPendiente)
      : Number(cuenta.monto)
  }, [cuenta, pagosCuenta])

  // Datos de renta
  const selectedRenta = useMemo(
    () => rentas.find(r => r.id === Number(form.rentaId)),
    [rentas, form.rentaId]
  )
  const montoMensual = selectedRenta ? Number(selectedRenta.montoMensual) : 0
  const totalRenta = montoMensual
  const mesesPagados = useMemo(
    () =>
      pagos
        .filter(
          p => p.tipo === 'PAGO_RENTA' && p.rentaId === Number(form.rentaId)
        )
        .reduce((sum, p) => sum + (p.CantMeses || 0), 0),
    [pagos, form.rentaId]
  )

  const handleChange = (field, value) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async () => {
    try {
      const payload = {
        cuentaId: Number(form.cuentaId),
        tipo: form.tipo,
        monto: Number(form.monto),
      }

      if (form.tipo === 'INTERES') {
        payload.mesInicio = form.mesInicio
        payload.mesFin = form.mesFin
        payload.CantMeses = contarMesesCompletos(form.mesInicio, form.mesFin)
      }

      if (form.tipo === 'ABONO_CAPITAL') {
        const montoAbono = Number(form.monto)
        payload.saldoPendiente = Number(
          (ultimoSaldo - montoAbono).toFixed(2)
        )
      }

      if (form.tipo === 'PAGO_RENTA') {
        payload.rentaId = Number(form.rentaId)
        payload.monto = form.monto || montoMensual
        payload.fechaPago = new Date(`${form.fechaPago}-01`)
      }


      await dispatch(createPago(payload)).unwrap()
      toast({ status: 'success', title: 'Pago registrado' })
      dispatch(fetchPagos())
      setForm({
        cuentaId: '',
        tipo: '',
        monto: '',
        mesInicio: '',
        mesFin: '',
        rentaId: '',
        CantMeses: ''
      })
    } catch (e) {
      toast({ status: 'error', title: 'Error', description: e.message })
    }
  }

  function contarMesesCompletos(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    if (fin < inicio) return 0

    let meses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth())

    // Si el día del mes en la fecha final es mayor o igual que el de inicio, cuenta como mes completo
    if (fin.getDate() >= inicio.getDate()) {
      meses += 1
    }

    return Math.max(meses, 1)
  }


  useEffect(() => {
    if (
      form.tipo === 'INTERES' &&
      form.mesInicio &&
      form.mesFin &&
      cuenta?.monto &&
      cuenta?.interes
    ) {
      const cantidadMeses = contarMesesCompletos(form.mesInicio, form.mesFin)

const interesMensual = Number(cuenta.interes) / 100
const montoCalculado = Number(cuenta.monto) * interesMensual * cantidadMeses


      setForm(f => ({
        ...f,
        CantMeses: cantidadMeses,
        monto: montoCalculado.toFixed(2)
      }))
    }
  }, [form.mesInicio, form.mesFin, cuenta, form.tipo])




  return (
    <Box p={6}>
      <Heading mb={4}>Pagos</Heading>
      <VStack align="start" spacing={4} mb={6} w="full">
        {/* Selección de Cuenta */}
        <FormControl isRequired>
          <FormLabel>Cuenta</FormLabel>
          <Menu isLazy closeOnSelect>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              w="full"
              textAlign="left"
              variant="outline"
            >
              {cuenta
                ? `${cuenta.cliente.nombre} ${cuenta.cliente.apellido}`
                : 'Selecciona cuenta'}
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto" p={2}>
              <Input
                placeholder="Buscar nombre o escritura…"
                size="sm"
                mb={2}
                value={menuFilter}
                onChange={e => setMenuFilter(e.target.value)}
              />
              {cuentas
                .filter(c => {
                  const term = menuFilter.toLowerCase()
                  const nombre = `${c.cliente?.nombre} ${c.cliente?.apellido}`.toLowerCase()
                  const num = String(c.numeroEscritura).toLowerCase()
                  return nombre.includes(term) || num.includes(term)
                })
                .map(c => (
                  <MenuItem
                    key={c.id}
                    onClick={() => {
                      handleChange('cuentaId', String(c.id))
                      setMenuFilter('')
                    }}
                    _focus={{ bg: 'gray.50' }}
                  >
                    <Flex justify="space-between" align="center" w="full">
                      <Box textAlign="left">
                        <Text fontWeight="medium">
                          {c.cliente.nombre} {c.cliente.apellido}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Escritura: {c.numeroEscritura}
                        </Text>
                      </Box>
                      <Badge
                        variant="subtle"
                        colorScheme={c.tipo === 'PRESTAMO' ? 'green' : 'blue'}
                      >
                        {c.tipo}
                      </Badge>
                    </Flex>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
        </FormControl>

        {/* Tipo de pago */}
        {cuenta && (
          <FormControl isRequired>
            <FormLabel>Tipo de Pago</FormLabel>
            <Select
              placeholder="Selecciona tipo"
              value={form.tipo}
              onChange={e => {
                handleChange('tipo', e.target.value)
                setForm(f => ({
                  ...f,
                  monto: '',
                  mesInicio: '',
                  mesFin: '',
                  rentaId: '',
                  CantMeses: ''
                }))
              }}
            >
              {cuenta.tipo === 'PRESTAMO' && (
                <>
                  <option value="INTERES">Interés</option>
                  <option value="ABONO_CAPITAL">Abono a Capital</option>
                </>
              )}
              {cuenta.tipo === 'RENTA' && (
                <option value="PAGO_RENTA">Pago de Renta</option>
              )}
            </Select>
          </FormControl>
        )}

        {/* Campos para INTERÉS */}
        {form.tipo === 'INTERES' && (
          <Stack spacing={2} w="full">
            <Input
              type="date"
              value={form.mesInicio}
              onChange={e => handleChange('mesInicio', e.target.value)}
            />
            ...
            <Input
              type="date"
              value={form.mesFin}
              onChange={e => handleChange('mesFin', e.target.value)}
            />


            {/* Cálculo de monto automáticamente */}
            {cuenta && form.mesInicio && form.mesFin && (
              <>
                <Text>
                  Interés mensual: {(Number(cuenta.interes)).toFixed(2)}%
                </Text>


                <Text>
                  Cantidad de meses: {
                    form.mesInicio && form.mesFin
                      ? contarMesesCompletos(form.mesInicio, form.mesFin)
                      : 'N/A'
                  }
                </Text>


                <FormControl isRequired>
                  <FormLabel>Monto a pagar</FormLabel>
                  <NumberInput
                    value={form.monto}
                    isReadOnly
                    precision={2}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </>
            )}
          </Stack>
        )}
        a

        {/* Campos para ABONO A CAPITAL */}
        {form.tipo === 'ABONO_CAPITAL' && (
          <Stack spacing={2} w="full">
            <FormControl isRequired>
              <FormLabel>Monto a Abonar</FormLabel>
              <NumberInput
                precision={2}
                value={form.monto}
                onChange={(_, v) => handleChange('monto', String(v))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <Text>Saldo Anterior: Q{ultimoSaldo.toFixed(2)}</Text>
            <Text>
              Saldo Nuevo: Q{(ultimoSaldo - Number(form.monto)).toFixed(2)}
            </Text>
          </Stack>
        )}

        {/* Campos para PAGO DE RENTA */}
        {form.tipo === 'PAGO_RENTA' && (
          <Stack spacing={2} w="full">
            <FormControl>
              <FormLabel>Contrato de Renta</FormLabel>
              <Input
                isReadOnly
                value={
                  selectedRenta
                    ? `Inicio: ${selectedRenta.fechaInicio.substring(0, 7)}`
                    : 'No hay renta asociada'
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mes de Pago</FormLabel>
              <Input
                type="month"
                value={form.fechaPago}
                onChange={(e) => handleChange('fechaPago', e.target.value)}
              />
            </FormControl>
            <Text>Monto mensual: Q{montoMensual.toFixed(2)}</Text>
            <FormControl isRequired>
              <FormLabel>Total a pagar</FormLabel>
              <NumberInput
                precision={2}
                min={0}
                value={form.monto}
                onChange={(_, value) => handleChange('monto', String(value))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </Stack>
        )}

        <Button
          colorScheme="teal"
          leftIcon={<FiPlus />}
          onClick={handleSubmit}
          isDisabled={
            !form.cuentaId ||
            !form.tipo ||
            (form.tipo === 'INTERES' && (!form.mesInicio || !form.mesFin)) ||
            (form.tipo === 'ABONO_CAPITAL' && !form.monto) ||
            (form.tipo === 'PAGO_RENTA' && (!form.rentaId || !form.fechaPago))
          }
        >
          Registrar Pago
        </Button>
      </VStack>

      <Divider mb={6} />

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Cuenta</Th>
            <Th>Tipo</Th>
            <Th>Monto</Th>
            <Th>Fecha</Th>
            <Th>Detalles</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pagos.map(p => (
            <Tr key={p.id}>
              <Td>{p.id}</Td>
              <Td>{p.cuenta?.numeroEscritura}</Td>
              <Td>{p.tipo}</Td>
              <Td>Q{Number(p.monto).toFixed(2)}</Td>
              <Td>{new Date(p.fechaPago).toLocaleDateString()}</Td>
              <Td>
                {p.tipo === 'INTERES' && (
                  <>Periodo: {p.mesInicio?.substring(0, 7)} – {p.mesFin?.substring(0, 7)} ({contarMesesCompletos(p.mesInicio, p.mesFin)} meses)</>
                )}
                {p.tipo === 'ABONO_CAPITAL' && (
                  <>Saldo: Q{Number(p.saldoPendiente).toFixed(2)}</>
                )}
                {p.tipo === 'PAGO_RENTA' && (
                  <>Meses: {p.CantMeses}</>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
