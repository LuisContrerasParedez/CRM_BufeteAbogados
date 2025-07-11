import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiLogOut, FiUserPlus, FiCreditCard } from 'react-icons/fi';

export default function Home() {
  const navigate = useNavigate();

  // Paleta sobria para bufete
  const bg = useColorModeValue('#F7F7F7', 'gray.800');
  const headerBg = useColorModeValue('#2A4365', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');
  const footerBg = useColorModeValue('#EDF2F7', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const accent = '#D69E2E';
  const accentHover = '#B97D0D';

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3 });

  const modules = [
    {
      icon: FiUserPlus,
      title: 'Clientes',
      desc: 'Registra un cliente en el sistema',
      route: '/clientes',
    },
    {
      icon: FiCreditCard,
      title: 'Crear Cuenta',
      desc: 'Abre una nueva cuenta para un cliente',
      route: '/cuenta',
    },
    {
      icon: null,         // Aquí no usamos icon
      title: 'Ingresar Pagos',
      desc: 'Pago de intereses y abono a capital',
      route: '/pagos',
    },
  ];

  return (
    <Flex direction="column" minH="100vh" bg={bg} color={textColor}>
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
            NEGOCIOS REALES S.A
          </Heading>
          <Text fontSize="sm" opacity={0.8}>
            Administración profesional
          </Text>
        </Box>
        <Button
          leftIcon={<FiLogOut />}
          variant="ghost"
          color="white"
          border="1px solid"
          borderColor="whiteAlpha.700"
          borderRadius="md"
          px={4}
          py={2}
          fontWeight="medium"
          transition="all 0.2s"
          _hover={{
            bg: 'whiteAlpha.200',
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          }}
          _active={{
            bg: 'whiteAlpha.300',
            transform: 'translateY(0)',
            boxShadow: 'sm',
          }}
          size="sm"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Cerrar Sesión
        </Button>

      </Flex>

      {/* MAIN */}
      <Container maxW="container.xl" flex="1" py={12}>
        <Heading
          textAlign="center"
          color={accent}
          fontSize={{ base: '2xl', md: '4xl' }}
          mb={2}
        >
          Panel de Control
        </Heading>
        <Text textAlign="center" mb={10} color="gray.600">
          Selecciona una opción para comenzar
        </Text>

        <SimpleGrid columns={columns} spacing={8}>
          {modules.map(({ icon: IconComp, title, desc, route }) => (
            <Box
              key={title}
              bg={cardBg}
              rounded="lg"
              shadow="md"
              p={6}
              role="group"
              display="flex"
              flexDirection="column"
              transition="all 0.3s"
              _hover={{
                shadow: 'xl',
                transform: 'translateY(-4px)',
              }}
            >
              {/* Icono o Q */}
              {title === 'Ingresar Pagos' ? (
                <Text
                  fontSize="4xl"
                  mb={4}
                  color={accent}
                  _groupHover={{ color: accentHover }}
                  textAlign="center"
                >
                  Q
                </Text>
              ) : (
                <Box
                  as={IconComp}
                  boxSize={10}
                  mb={4}
                  color={accent}
                  _groupHover={{ color: accentHover }}
                  mx="auto"
                />
              )}

              <Heading fontSize="xl" mb={2} textAlign="center">
                {title}
              </Heading>
              <Text flex="1" textAlign="center" color="gray.500" mb={4}>
                {desc}
              </Text>
              <Button
                alignSelf="center"
                px={8}
                borderRadius="full"
                bg={accent}
                color="white"
                _hover={{ bg: accentHover }}
                onClick={() => navigate(route)}
              >
                Ir a {title}
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* FOOTER */}
      <Box as="footer" bg={footerBg} py={4} textAlign="center">
        <Text fontSize="sm" color="gray.600">
          © 2025 Negocios Reales S.A
        </Text>
      </Box>
    </Flex>
  );
}
