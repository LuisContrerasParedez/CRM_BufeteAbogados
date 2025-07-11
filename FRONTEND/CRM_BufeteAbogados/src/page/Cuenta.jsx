import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCuentas,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} from '../store/cuentas/thunks'
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
  Stack,
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
  const textColor = useBreakpointValue({ base: 'white', md: 'white' })

  const [form, setForm] = useState({ numeroEscritura: '', tipo: 'PRESTAMO', monto: '', clienteId: '' })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const { items: cuentas, loading: loadingCuentas } = useSelector(state => state.cuentas)
  const { clientes, loading: loadingClientes } = useSelector(state => state.cliente)

  useEffect(() => {
    dispatch(fetchCuentas())
    dispatch(fetchClientes())
  }, [dispatch])

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

  const handleOpenNew = () => {
    setEditId(null)
    setForm({ numeroEscritura: '', tipo: 'PRESTAMO', monto: '', clienteId: '' })
    onOpen()
  }

  const handleOpenEdit = c => {
    setEditId(c.id)
    setForm({
      numeroEscritura: c.numeroEscritura,
      tipo: c.tipo,
      monto: String(c.monto),
      clienteId: String(c.clienteId || c.cliente?.id || ''),
    })
    onOpen()
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        numeroEscritura: form.numeroEscritura.trim(),
        tipo: form.tipo,
        monto: parseFloat(form.monto),
        clienteId: parseInt(form.clienteId, 10),
      }
      if (editId) {
        await dispatch(updateCuenta({ id: editId, ...payload })).unwrap()
        toast({ status: 'success', title: 'Cuenta actualizada' })
      } else {
        await dispatch(createCuenta(payload)).unwrap()
        toast({ status: 'success', title: 'Cuenta creada' })
      }
      onClose()
    } catch (e) {
      toast({ status: 'error', title: 'Error', description: e.message })
    }
  }

  const handleDelete = async id => {
    try {
      await dispatch(deleteCuenta(id)).unwrap()
      toast({ status: 'info', title: 'Cuenta eliminada' })
    } catch (e) {
      toast({
        status: 'error',
        title: 'No se puede eliminar',
        description: 'La cuenta tiene pagos o rentas asociadas.',
        duration: 8000,
        isClosable: true,
      })
    }
  }

  if (loadingCuentas || loadingClientes) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Text>Cargando cuentas...</Text>
      </Flex>
    )
  }

  return (
    <Flex direction="column" minH="100vh" bg={bg}>
      {/* HEADER con Título y Acciones */}
      <Flex as="header" bg={headerBg} color={textColor} px={6} py={4} align="center" justify="space-between">
        <Box>
          <Heading size="lg">Gestión de Cuentas</Heading>
          <Text fontSize="sm">Administra préstamos y rentas asignadas</Text>
        </Box>
        <HStack spacing={2}>
          <IconButton icon={<FiHome />} aria-label="Inicio" variant="ghost" color="white" onClick={() => navigate('/')} />
          <Button leftIcon={<FiList />} variant="outline" colorScheme="whiteAlpha" onClick={() => { setShowAll(true); setSearch('') }}>
            Ver Todas
          </Button>
          <Button leftIcon={<FiPlus />} colorScheme="yellow" onClick={handleOpenNew}>
            Nueva Cuenta
          </Button>
        </HStack>
      </Flex>

      <Container maxW="container.xl" py={6} flex="1">
        {/* Barra de búsqueda fija */}
        <Flex mb={4} align="center">
          <InputGroup>
            <InputLeftElement pointerEvents="none"><FiSearch color="gray.400" /></InputLeftElement>
            <Input
              placeholder="Buscar escritura o cliente..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowAll(false) }}
            />
          </InputGroup>
        </Flex>

        {/* Resultados en tarjetas */}
        {!displayed.length ? (
          <Flex h="60vh" align="center" justify="center">
            <Text color="gray.500">Sin resultados. Utiliza el buscador o "Ver Todas".</Text>
          </Flex>
        ) : (
          <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={4}>
            {displayed.map(c => (
              <GridItem key={c.id} bg="white" p={4} shadow="base" borderRadius="md">
                <Flex justify="space-between" align="center">
                  <Avatar name={getNombreCliente(c)} size="sm" />
                  <Badge colorScheme={c.tipo === 'PRESTAMO' ? 'green' : 'purple'}>{c.tipo}</Badge>
                </Flex>
                <Heading size="md" mt={2}> Numero de escritura: {c.numeroEscritura}</Heading>
                <Text mt={1}>Cliente: {getNombreCliente(c)}</Text>
                <Text mt={1} fontWeight="bold">Monto: Q{Number(c.monto).toFixed(2)}</Text>
                <Divider my={3} />
                <Flex justify="flex-end">
                  <Tooltip label="Editar"><IconButton icon={<FiEdit2 />} size="sm" mr={2} onClick={() => handleOpenEdit(c)} /></Tooltip>
                  <Tooltip label="Eliminar"><IconButton icon={<FiTrash2 />} size="sm" colorScheme="red" onClick={() => handleDelete(c.id)} /></Tooltip>
                </Flex>
              </GridItem>
            ))}
          </Grid>
        )}
      </Container>

      {/* Modal Crear/Editar */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? 'Editar Cuenta' : 'Nueva Cuenta'}</ModalHeader>
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Escritura</FormLabel>
              <Input value={form.numeroEscritura} onChange={e => setForm(f => ({ ...f, numeroEscritura: e.target.value }))} />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Cliente</FormLabel>
              <Select placeholder="Selecciona cliente" value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
                {clientes.map(cli => <option key={cli.id} value={cli.id}>{`${cli.nombre} ${cli.apellido}`}</option>)}
              </Select>
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Tipo</FormLabel>
              <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="PRESTAMO">PRÉSTAMO</option>
                <option value="RENTA">RENTA</option>
              </Select>
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Monto</FormLabel>
              <NumberInput min={0} precision={2} value={form.monto} onChange={(_, val) => setForm(f => ({ ...f, monto: String(val) }))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="yellow" onClick={handleSubmit} isDisabled={!form.numeroEscritura || !form.clienteId || !form.monto}>
              {editId ? 'Guardar' : 'Crear'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* FOOTER */}
      <Box as="footer" bg="gray.100" py={4} textAlign="center">
        <Text fontSize="sm" color="gray.600">© 2025 Bufete Abogados CRM</Text>
      </Box>
    </Flex>
  )
}
