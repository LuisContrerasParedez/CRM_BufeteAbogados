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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  VStack,
  HStack,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiHome, FiList } from 'react-icons/fi'

export default function Cuenta() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  // Tema
  const bg = useBreakpointValue({ base: '#F7F7F7' })
  const headerBg = useBreakpointValue({ base: '#2A4365' })
  const footerBg = useBreakpointValue({ base: '#EDF2F7' })
  const textColor = useBreakpointValue({ base: 'gray.700' })
  const accent = '#D69E2E'
  const accentHover = '#B97D0D'

  const { items: cuentas, loading: loadingCuentas } = useSelector(
    state => state.cuentas,
  )
  const { clientes, loading: loadingClientes } = useSelector(
    state => state.cliente,
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [form, setForm] = useState({ numeroEscritura: '', tipo: 'PRESTAMO', monto: '', clienteId: '' })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    dispatch(fetchCuentas())
    dispatch(fetchClientes())
  }, [dispatch])

  // Filtrar dinámicamente por búsqueda
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return []
    return cuentas.filter(c =>
      c.numeroEscritura.toLowerCase().includes(term) ||
      `${c.cliente?.nombre || ''} ${c.cliente?.apellido || ''}`.toLowerCase().includes(term)
    )
  }, [cuentas, search])

  // Lista a mostrar: todas o filtradas
  const displayed = useMemo(() => {
    if (showAll) return cuentas
    if (search.trim()) return filtered
    return []
  }, [showAll, search, cuentas, filtered])

  // Helper para nombre de cliente
  const getNombreCliente = c => {
    if (c.cliente && c.cliente.nombre) {
      return `${c.cliente.nombre} ${c.cliente.apellido}`
    }
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
      if (e.response?.status === 500 || e.message?.includes('500')) {
        toast({
          status: 'error',
          title: 'No se puede eliminar',
          description: 'La cuenta tiene pagos o rentas asociadas y no puede eliminarse.',
          duration: 8000,
          isClosable: true,
        })
      } else {
        toast({ status: 'error', title: 'Error', description: e.message })
      }
    }
  }

  if (loadingCuentas || loadingClientes) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" />
      </Flex>
    )
  }

  return (
    <Flex direction="column" minH="100vh" bg={bg} color={textColor}>
      {/* HEADER */}
      <Flex as="header" bg={headerBg} color="white" align="center" justify="space-between" py={4} px={{ base: 4, md: 8 }}>
        <Heading fontSize={{ base: 'lg', md: '2xl' }} letterSpacing="wide" fontWeight="semibold">
          NEGOCIOS REALES S.A
        </Heading>
        <Button
          leftIcon={<FiHome />}
          variant="outline"
          borderColor="whiteAlpha.700"
          _hover={{ bg: 'whiteAlpha.200' }}
          size="lg"
          onClick={() => navigate('/')}
        >
          Inicio
        </Button>
      </Flex>

      {/* MAIN */}
      <Container maxW="container.xl" flex="1" py={12}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={accent}>Gestión de Cuentas</Heading>
          <HStack spacing={6}>
            <InputGroup maxW="md">
              <InputLeftElement pointerEvents="none"><FiSearch color="gray.400" /></InputLeftElement>
              <Input
                placeholder="Buscar escritura o cliente..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowAll(false) }}
                size="lg"
              />
            </InputGroup>
            <Button leftIcon={<FiList />} bg="white" border="1px solid" borderColor="gray.200" size="lg" onClick={() => { setShowAll(true); setSearch('') }}>
              Ver Todas
            </Button>
            <Button leftIcon={<FiPlus />} bg={accent} color="white" _hover={{ bg: accentHover }} size="lg" onClick={handleOpenNew}>
              Nueva Cuenta
            </Button>
          </HStack>
        </Flex>

        {/* Resultados */}
        {!displayed.length ? (
          <Flex justify="center" py={10}><Text color="gray.500">Usa el buscador o "Ver Todas" para listar cuentas.</Text></Flex>
        ) : (
          <Box boxShadow="md" borderRadius="lg" overflow="hidden" bg="white">
            <Table variant="simple" size="md">
              <Thead bg={accent}><Tr><Th color="white">ID</Th><Th color="white">Escritura</Th><Th color="white">Tipo</Th><Th color="white" isNumeric>Monto</Th><Th color="white">Cliente</Th><Th color="white">Acciones</Th></Tr></Thead>
              <Tbody>
                {displayed.map(c => (
                  <Tr key={c.id} _hover={{ bg: 'gray.50' }}>
                    <Td>{c.id}</Td>
                    <Td>{c.numeroEscritura}</Td>
                    <Td><Badge colorScheme={c.tipo==='PRESTAMO'?'green':'purple'}>{c.tipo}</Badge></Td>
                    <Td isNumeric>Q{Number(c.monto).toFixed(2)}</Td>
                    <Td>{getNombreCliente(c)}</Td>
                    <Td><HStack><IconButton icon={<FiEdit2 />} size="md" variant="ghost" onClick={()=>handleOpenEdit(c)} aria-label="Editar"/><IconButton icon={<FiTrash2 />} size="md" variant="ghost" colorScheme="red" onClick={()=>handleDelete(c.id)} aria-label="Eliminar"/></HStack></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Modal Crear/Editar */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editId ? 'Editar Cuenta':'Nueva Cuenta'}</ModalHeader>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired><FormLabel>Escritura</FormLabel><Input value={form.numeroEscritura} onChange={e=>setForm(f=>({...f,numeroEscritura:e.target.value}))} size="lg"/></FormControl>
                <FormControl isRequired><FormLabel>Cliente</FormLabel><Select placeholder="Selecciona cliente" value={form.clienteId} onChange={e=>setForm(f=>({...f,clienteId:e.target.value}))} size="lg">{clientes.map(cli=><option key={cli.id} value={String(cli.id)}>{cli.nombre} {cli.apellido}</option>)}</Select></FormControl>
                <FormControl isRequired><FormLabel>Tipo</FormLabel><Select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} size="lg"><option value="PRESTAMO">PRÉСТАМО</option><option value="RENTA">RENTA</option></Select></FormControl>
                <FormControl isRequired><FormLabel>Monto</FormLabel><NumberInput min={0} precision={2} value={form.monto} onChange={(_,val)=>setForm(f=>({...f,monto:String(val)}))} size="lg"><NumberInputField/></NumberInput></FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter><Button variant="ghost" mr={3} onClick={onClose} size="lg">Cancelar</Button><Button bg={accent} color="white" _hover={{bg:accentHover}} onClick={handleSubmit} isDisabled={!form.numeroEscritura||!form.clienteId||!form.tipo||!form.monto} size="lg">{editId?'Guardar':'Crear'}</Button></ModalFooter>
          </ModalContent>
        </Modal>
      </Container>

      {/* FOOTER */}
      <Box as="footer" bg={footerBg} py={4} textAlign="center"><Text fontSize="sm" color="gray.600">© 2025 Bufete Abogados CRM — Diseñado para facilitar el trabajo diario</Text></Box>
    </Flex>
  )
}
