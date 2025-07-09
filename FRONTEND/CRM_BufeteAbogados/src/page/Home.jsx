import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiLogOut, FiUserPlus, FiUsers, FiSettings } from 'react-icons/fi';

export default function Home() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Paleta de colores tipo bufete
  const bg = '#F7F1ED';
  const headerBg = '#8B5E3C';
  const cardBg = '#FFFFFF';
  const accent = '#8B5E3C';
  const accentHover = '#A06B46';
  const footerBg = '#EAE4DC';

  // Responsive columns
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  return (
    <Flex direction="column" minH="100vh" bg={bg}>
      {/* HEADER */}
      <Flex
        as="header"
        bg={headerBg}
        color="white"
        align="center"
        justify="space-between"
        px={[4, 8]}
        py={4}
        boxShadow="md"
      >
        <Box>
          <Heading size="md">CRM Bufete Abogados</Heading>
          <Text fontSize="sm">Administración sencilla y profesional</Text>
        </Box>
        <Button
          leftIcon={<FiLogOut />}
          variant="outline"
          borderColor="whiteAlpha.700"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={cerrarSesion}
          size="sm"
        >
          Cerrar Sesión
        </Button>
      </Flex>

      {/* MAIN CONTENT */}
      <Box as="main" flex="1" px={[4, 8]} py={10}>
        <Heading mb={6} color={accent} textAlign="center">
          Panel Principal
        </Heading>
        <Text mb={10} textAlign="center" color="gray.600">
          Selecciona una opción para comenzar
        </Text>

        <SimpleGrid columns={columns} spacing={8}>
          {/* Tarjeta: Nuevo Cliente */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.2s"
            textAlign="center"
          >
            <Icon as={FiUserPlus} boxSize={10} color={accent} mb={4} />
            <Heading size="md" mb={2}>
              Nuevo Cliente
            </Heading>
            <Text mb={4} color="gray.500">
              Registra un cliente en el sistema
            </Text>
            <Button
              mt="auto"
              leftIcon={<FiUserPlus />}
              bg={accent}
              color="white"
              _hover={{ bg: accentHover }}
              onClick={() => navigate('/clientes')}
            >
              Ingresar
            </Button>
          </Box>

          {/* Tarjeta: Lista de Clientes */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            opacity={0.6}
            cursor="not-allowed"
            textAlign="center"
          >
            <Icon as={FiUsers} boxSize={10} color="gray.400" mb={4} />
            <Heading size="md" mb={2} color="gray.600">
              Lista de Clientes
            </Heading>
            <Text mb={4} color="gray.500">
              Disponible próximamente
            </Text>
            <Button size="sm" variant="outline" isDisabled>
              Pronto
            </Button>
          </Box>

          {/* Tarjeta: Ajustes del Sistema */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            opacity={0.6}
            cursor="not-allowed"
            textAlign="center"
          >
            <Icon as={FiSettings} boxSize={10} color="gray.400" mb={4} />
            <Heading size="md" mb={2} color="gray.600">
              Ajustes del Sistema
            </Heading>
            <Text mb={4} color="gray.500">
              Disponible próximamente
            </Text>
            <Button size="sm" variant="outline" isDisabled>
              Pronto
            </Button>
          </Box>
        </SimpleGrid>
      </Box>

      {/* FOOTER */}
      <Box
        as="footer"
        bg={footerBg}
        borderTop="1px solid #D6CFC7"
        py={4}
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.700">
          © 2025 Bufete Abogados CRM — Diseñado para facilitar el trabajo diario
        </Text>
      </Box>
    </Flex>
  );
}
