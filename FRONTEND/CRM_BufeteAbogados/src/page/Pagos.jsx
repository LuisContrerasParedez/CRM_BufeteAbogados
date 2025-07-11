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
    CantMeses: ''
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
  const totalRenta = montoMensual * (Number(form.CantMeses) || 0)
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
        payload.CantMeses = Math.max(
          1,
          Math.floor(
            (new Date(form.mesFin) - new Date(form.mesInicio)) /
              (1000 * 60 * 60 * 24 * 30)
          ) + 1
        )
      }

      if (form.tipo === 'ABONO_CAPITAL') {
        const montoAbono = Number(form.monto)
        payload.saldoPendiente = Number(
          (ultimoSaldo - montoAbono).toFixed(2)
        )
      }

      if (form.tipo === 'PAGO_RENTA') {
        payload.rentaId = Number(form.rentaId)
        payload.CantMeses = Number(form.CantMeses)
        payload.monto = totalRenta
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
            <FormControl isRequired>
              <FormLabel>Mes Inicio</FormLabel>
              <Input
                type="month"
                value={form.mesInicio}
                onChange={e => handleChange('mesInicio', e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mes Fin</FormLabel>
              <Input
                type="month"
                value={form.mesFin}
                onChange={e => handleChange('mesFin', e.target.value)}
              />
            </FormControl>
          </Stack>
        )}

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
            <FormControl isRequired>
              <FormLabel>Contrato de Renta</FormLabel>
              <Select
                placeholder="Selecciona renta"
                value={form.rentaId}
                onChange={e => handleChange('rentaId', e.target.value)}
              >
                {rentas
                  .filter(r => r.cuentaId === Number(form.cuentaId))
                  .map(r => (
                    <option key={r.id} value={r.id}>
                      Inicio: {r.fechaInicio.substring(0, 7)}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Meses a pagar</FormLabel>
              <NumberInput
                min={1}
                value={form.CantMeses}
                onChange={(_, v) => handleChange('CantMeses', String(v))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <Text>Monto mensual: Q{montoMensual.toFixed(2)}</Text>
            <Text fontWeight="semibold">
              Total a pagar: Q{totalRenta.toFixed(2)}
            </Text>
            <Text>Meses ya pagados: {mesesPagados}</Text>
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
            (form.tipo === 'PAGO_RENTA' && (!form.rentaId || !form.CantMeses))
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
                  <>Periodo: {p.mesInicio?.substring(0, 7)} – {p.mesFin?.substring(0, 7)} ({p.CantMeses} meses)</>
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
