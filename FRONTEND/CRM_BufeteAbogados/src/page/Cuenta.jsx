import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCuentas,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} from '../store/cuentas/thunks'
import { rentasThunks } from '../store/Renta'
import { fetchClientes } from '../store/clientes/thunks'
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  HStack,
  VStack,
  Grid,
  GridItem,
  Avatar,
  Badge,
  Divider,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiHome, FiList } from 'react-icons/fi'

export default function Cuenta() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Tema responsivo
  const bg = useBreakpointValue({ base: 'gray.50', md: 'white' })
  const headerBg = useBreakpointValue({ base: 'blue.600', md: 'blue.700' })
  const textColor = 'white'

  // Estado del formulario
  const [form, setForm] = useState({
    numeroEscritura: '',
    tipo: 'PRESTAMO',
    monto: '',       // Monto para préstamo
    interes: '',     // Interés para préstamo
    clienteId: '',
    fechaInicio: '', // Fecha de inicio para renta
    montoMensual: '' // Monto mensual para renta
  })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const { items: cuentas, loading: loadingCuentas } = useSelector(s => s.cuentas)
  const { clientes, loading: loadingClientes } = useSelector(s => s.cliente)

  useEffect(() => {
    dispatch(fetchCuentas())
    dispatch(fetchClientes())
  }, [dispatch])

  // Filtrado y búsqueda
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return []
    return cuentas.filter(c =>
      c.numeroEscritura.toLowerCase().includes(term) ||
      `${c.cliente?.nombre || ''} ${c.cliente?.apellido || ''}`.toLowerCase().includes(term)
    )
  }, [search, cuentas])

  const displayed = useMemo(() => {
    if (showAll) return cuentas
    if (search.trim()) return filtered
    return []
  }, [showAll, search, cuentas, filtered])

  const getNombreCliente = c => {
    if (c.cliente) return `${c.cliente.nombre} ${c.cliente.apellido}`
    const cli = clientes.find(cli => cli.id === Number(c.clienteId))
    return cli ? `${cli.nombre} ${cli.apellido}` : '-'
  }

  // Abrir modal para nueva cuenta
  const openNew = () => {
    setEditId(null)
    setForm({ numeroEscritura: '', tipo: 'PRESTAMO', monto: '', interes: '', clienteId: '', fechaInicio: '', montoMensual: '' })
    onOpen()
  }

  // Abrir modal para editar cuenta
  const openEdit = c => {
    setEditId(c.id)
    setForm({
      numeroEscritura: c.numeroEscritura,
      tipo: c.tipo,
      monto: c.tipo === 'PRESTAMO' ? String(c.monto) : '',
      interes: c.tipo === 'PRESTAMO' && c.interes != null ? String(c.interes) : '',
      clienteId: String(c.clienteId),
      fechaInicio: c.tipo === 'RENTA' ? c.contratoRenta?.fechaInicio?.substring(0, 10) || '' : '',
      montoMensual: c.tipo === 'RENTA' && c.contratoRenta?.montoMensual ? String(c.contratoRenta.montoMensual) : ''
    })
    onOpen()
  }

  // Enviar formulario
  const handleSubmit = async () => {
    try {
      const payload = {
        numeroEscritura: form.numeroEscritura.trim(),
        tipo: form.tipo,
        clienteId: parseInt(form.clienteId, 10),
        // Para préstamo
        ...(form.tipo === 'PRESTAMO' && {
          monto: parseFloat(form.monto),
          interes: parseFloat(form.interes)
        }),
        // Para renta usamos montoMensual como monto
        ...(form.tipo === 'RENTA' && { monto: parseFloat(form.montoMensual) })
      }

      let cuentaRes
      if (editId) {
        cuentaRes = await dispatch(updateCuenta({ id: editId, ...payload })).unwrap()
        toast({ status: 'success', title: 'Cuenta actualizada' })
      } else {
        cuentaRes = await dispatch(createCuenta(payload)).unwrap()
        toast({ status: 'success', title: 'Cuenta creada' })
      }

      // Si es renta, crear/actualizar contrato de renta
      if (form.tipo === 'RENTA') {
        const rentaData = {
          cuentaId: cuentaRes.id,
          fechaInicio: form.fechaInicio,
          montoMensual: parseFloat(form.montoMensual)
        }
        if (editId && cuentaRes.contratoRenta) {
          await dispatch(rentasThunks.updateRenta({ id: cuentaRes.contratoRenta.id, changes: rentaData })).unwrap()
          toast({ status: 'success', title: 'Contrato de renta actualizado' })
        } else {
          await dispatch(rentasThunks.createRenta(rentaData)).unwrap()
          toast({ status: 'success', title: 'Contrato de renta creado' })
        }
      }

      onClose()
      dispatch(fetchCuentas())
    } catch (e) {
      toast({ status: 'error', title: 'Error', description: e.message })
    }
  }

  // Eliminar cuenta
  const handleDelete = async id => {
    try {
      await dispatch(deleteCuenta(id)).unwrap()
      toast({ status: 'info', title: 'Cuenta eliminada' })
    } catch {
      toast({ status: 'error', title: 'No se puede eliminar', description: 'Asociaciones existentes.', duration: 8000, isClosable: true })
    }
  }

  if (loadingCuentas || loadingClientes) return <Flex justify="center" align="center" h="60vh"><Text>Cargando cuentas...</Text></Flex>

  return (
    <Flex direction="column" minH="100vh" bg={bg}>
      {/* HEADER */}
      <Flex
        as="header"
        bg={headerBg}
        color="white"
        align="center"
        justify="space-between"
        py={4}
        px={{ base: 4, md: 8 }}
        boxShadow="sm"
      >
        <Box>
          <Heading
            fontSize={{ base: 'lg', md: '2xl' }}
            letterSpacing="wide"
            fontWeight="semibold"
          >
            Gestión de Cuentas
          </Heading>
          <Text fontSize="sm" opacity={0.8}>
            Administra Préstamos y Rentas
          </Text>
        </Box>

        {/* Conservamos tus botones originales */}
        <HStack spacing={3}>
          <Tooltip label="Volver al inicio" hasArrow placement="bottom">
            <IconButton
              icon={<FiHome />}
              aria-label="Inicio"
              variant="ghost"
              color="white"
              border="1px solid"
              borderColor="whiteAlpha.600"
              borderRadius="md"
              p={2}
              transition="all 0.2s"
              _hover={{
                bg: 'whiteAlpha.200',
                transform: 'scale(1.1)',
              }}
              _active={{
                bg: 'whiteAlpha.300',
                transform: 'scale(1)',
              }}
              onClick={() => navigate('/')}
            />
          </Tooltip>

          <Button
            leftIcon={<FiList />}
            variant="ghost"
            border="1px solid"
            borderColor="whiteAlpha.600"
            color="white"
            borderRadius="md"
            px={4}
            py={2}
            fontWeight="medium"
            transition="all 0.2s"
            _hover={{
              bg: 'whiteAlpha.200',
              transform: 'translateY(-1px)',
            }}
            _active={{
              bg: 'whiteAlpha.300',
              transform: 'translateY(0)',
            }}
            onClick={() => {
              setShowAll(true)
              setSearch('')
            }}
          >
            Ver Todas
          </Button>

          <Button
            leftIcon={<FiPlus />}
            colorScheme="yellow"
            variant="solid"
            borderRadius="md"
            px={4}
            py={2}
            fontWeight="medium"
            transition="all 0.2s"
            _hover={{
              bg: 'yellow.500',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            }}
            _active={{
              bg: 'yellow.600',
              transform: 'translateY(0)',
              boxShadow: 'sm',
            }}
            onClick={openNew}
          >
            Nueva Cuenta
          </Button>
        </HStack>

      </Flex>

      <Container maxW="container.xl" py={6} flex="1">
        {/* Search bar */}
        <Flex mb={4} align="center">
          <InputGroup>
            <InputLeftElement pointerEvents="none"><FiSearch color="gray.400" /></InputLeftElement>
            <Input placeholder="Buscar escritura o cliente..." value={search} onChange={e => { setSearch(e.target.value); setShowAll(false) }} />
          </InputGroup>
        </Flex>

        {/* Cards */}
        {!displayed.length ? (
          <Flex h="60vh" align="center" justify="center"><Text color="gray.500">Sin resultados.</Text></Flex>
        ) : (
          <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={4}>
            {displayed.map(c => (
              <GridItem key={c.id} bg="white" p={4} shadow="base" borderRadius="md">
                <Flex justify="space-between" align="center">
                  <Avatar name={getNombreCliente(c)} size="sm" />
                  <Badge colorScheme={c.tipo === 'PRESTAMO' ? 'green' : 'purple'}>{c.tipo}</Badge>
                </Flex>
                <Heading size="md" mt={2}>Numero de escritura: {c.numeroEscritura}</Heading>
                <Text mt={1}>Cliente: {getNombreCliente(c)}</Text>
                {c.tipo === 'PRESTAMO' && <Text mt={1} fontWeight="bold">Monto: Q{Number(c.monto).toFixed(2)}</Text>}
                {c.tipo === 'RENTA' && c.contratoRenta && <Text mt={1}>Renta Q{Number(c.contratoRenta.montoMensual).toFixed(2)}/mes</Text>}
                <Divider my={3} />
                <Flex justify="flex-end">
                  <Tooltip label="Editar"><IconButton icon={<FiEdit2 />} size="sm" mr={2} onClick={() => openEdit(c)} /></Tooltip>
                  <Tooltip label="Eliminar"><IconButton icon={<FiTrash2 />} size="sm" colorScheme="red" onClick={() => handleDelete(c.id)} /></Tooltip>
                </Flex>
              </GridItem>
            ))}
          </Grid>
        )}
      </Container>

      {/* Modal Create/Edit */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Editar Cuenta' : 'Nueva Cuenta'}</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Escritura</FormLabel>
                <Input value={form.numeroEscritura} onChange={e => setForm(f => ({ ...f, numeroEscritura: e.target.value }))} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Cliente</FormLabel>
                <Select placeholder="Selecciona cliente" value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
                  {clientes.map(cli => <option key={cli.id} value={cli.id}>{cli.nombre} {cli.apellido}</option>)}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  <option value="PRESTAMO">PRÉSTAMO</option>
                  <option value="RENTA">RENTA</option>
                </Select>
              </FormControl>
              {/* Campos para Préstamo */}
              {form.tipo === 'PRESTAMO' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Monto</FormLabel>
                    <NumberInput min={0} precision={2} value={form.monto} onChange={(_, val) => setForm(f => ({ ...f, monto: String(val) }))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Interés (%)</FormLabel>
                    <NumberInput min={0} precision={2} value={form.interes} onChange={(_, val) => setForm(f => ({ ...f, interes: String(val) }))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </>
              )}
              {/* Campos para Renta */}
              {form.tipo === 'RENTA' && (
                <>
                  <Divider />
                  <Text fontWeight="bold">Contrato de Renta</Text>
                  <FormControl isRequired>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Input type="date" value={form.fechaInicio} onChange={e => setForm(f => ({ ...f, fechaInicio: e.target.value }))} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Monto mensual</FormLabel>
                    <NumberInput min={0} precision={2} value={form.montoMensual} onChange={(_, val) => setForm(f => ({ ...f, montoMensual: String(val) }))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button
              colorScheme="yellow"
              onClick={handleSubmit}
              isDisabled={
                !form.numeroEscritura || !form.clienteId ||
                (form.tipo === 'PRESTAMO' && (!form.monto || !form.interes)) ||
                (form.tipo === 'RENTA' && (!form.fechaInicio || !form.montoMensual))
              }
            >
              {editId ? 'Guardar' : 'Crear'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* FOOTER */}
      <Box as="footer" bg="gray.100" py={4} textAlign="center">
        <Text fontSize="sm" color="gray.600">© 2025 Tu Aplicación</Text>
      </Box>
    </Flex>
  )
}
