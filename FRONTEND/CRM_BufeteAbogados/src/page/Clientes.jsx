import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  useToast,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Text,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientes, createCliente, deleteCliente } from '../store/clientes';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiPhone,
  FiPlus,
  FiArrowLeft,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';

export default function Clientes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstFieldRef = useRef();

  const { clientes, loading } = useSelector((state) => state.cliente);
  const [nuevo, setNuevo] = useState({ nombre: '', apellido: '', telefono: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!nuevo.nombre || !nuevo.apellido || !nuevo.telefono) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    dispatch(createCliente({ ...nuevo, telefono: +nuevo.telefono }));
    toast({
      title: 'Cliente creado',
      description: 'Registro exitoso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setNuevo({ nombre: '', apellido: '', telefono: '' });
    onClose();
  };

  const clientesFiltrados = clientes.filter((c) =>
    `${c.nombre} ${c.apellido}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  // Paleta original
  const bg = '#F7F1ED';
  const cardBg = '#FFFFFF';
  const accent = '#8B5E3C';
  const accentHover = '#A06B46';
  const textColor = '#2D2D2D';

  return (
    <Box
      bg={bg}
      w="100vw"
      minH="100vh"
      display="flex"
      flexDirection="column"
      overflowX="hidden"
    >
      {/* HEADER */}
      <Flex
        as="header"
        bg={accent}
        color="white"
        px={8}
        py={4}
        align="center"
        justify="space-between"
        boxShadow="md"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Heading size="lg">📋 Gestión de Clientes</Heading>
        <Flex gap={3}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="outline"
            borderColor="white"
            color="white"
            _hover={{ bg: accentHover, color: 'white' }}
            onClick={() => navigate('/')}
          >
            Inicio
          </Button>
          <Button
            leftIcon={<FiPlus />}
            bg="white"
            color={accent}
            _hover={{ bg: accentHover, color: 'white' }}
            onClick={onOpen}
          >
            Nuevo Cliente
          </Button>
        </Flex>
      </Flex>

      {/* CONTENIDO */}
      <Box flex="1" px={[4, 8]} py={6}>
        {/* Buscador */}
        <InputGroup maxW="360px" mb={6}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar cliente..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            bg={cardBg}
            focusBorderColor={accent}
          />
        </InputGroup>

        {/* Lista de clientes */}
        {loading ? (
          <Flex justify="center" mt={10}>
            <Spinner size="xl" color={accent} />
          </Flex>
        ) : clientesFiltrados.length === 0 ? (
          <Text color="gray.500">No se encontraron clientes.</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {clientesFiltrados.map((c) => (
              <Box
                key={c.id}
                bg={cardBg}
                p={5}
                borderRadius="xl"
                boxShadow="lg"
                position="relative"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                <Flex align="center" mb={3}>
                  <Icon as={FiUser} boxSize={6} color={accent} mr={3} />
                  <Heading size="md" color={textColor}>
                    {c.nombre} {c.apellido}
                  </Heading>
                </Flex>
                <Flex align="center" mb={4}>
                  <Icon as={FiPhone} boxSize={5} color="gray.600" mr={2} />
                  <Text color="gray.600">{c.telefono}</Text>
                </Flex>
                <IconButton
                  icon={<FiTrash2 />}
                  variant="outline"
                  colorScheme="red"
                  aria-label="Eliminar cliente"
                  onClick={() => dispatch(deleteCliente(c.id))}
                  position="absolute"
                  top="4"
                  right="4"
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* FOOTER */}
      <Box
        as="footer"
        textAlign="center"
        py={4}
        bg="#E8DED7"
        borderTop="1px solid #DDD"
      >
        <Text fontSize="sm" color="gray.600">
          © 2025 Bufete Abogados CRM — Todos los derechos reservados
        </Text>
      </Box>

      {/* DRAWER PARA CREAR CLIENTE */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstFieldRef}
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" color={accent}>
            Registrar Cliente
          </DrawerHeader>

          <DrawerBody py={6}>
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input
                ref={firstFieldRef}
                placeholder="Nombre"
                value={nuevo.nombre}
                onChange={(e) =>
                  setNuevo((n) => ({ ...n, nombre: e.target.value }))
                }
                focusBorderColor={accent}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Apellido</FormLabel>
              <Input
                placeholder="Apellido"
                value={nuevo.apellido}
                onChange={(e) =>
                  setNuevo((n) => ({ ...n, apellido: e.target.value }))
                }
                focusBorderColor={accent}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input
                placeholder="Teléfono"
                type="tel"
                value={nuevo.telefono}
                onChange={(e) =>
                  setNuevo((n) => ({ ...n, telefono: e.target.value }))
                }
                focusBorderColor={accent}
              />
            </FormControl>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              bg={accent}
              color="white"
              _hover={{ bg: accentHover }}
              onClick={handleSubmit}
            >
              Crear Cliente
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
