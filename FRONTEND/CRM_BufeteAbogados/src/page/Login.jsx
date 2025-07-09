import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Button,
  VStack,
  FormControl,
  FormErrorMessage,
  useColorModeValue,
  Fade,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { loginUsuario } from '../store/login/thunks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  nombre: yup.string().required('Nombre requerido'),
  contrasena: yup
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Contraseña requerida'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { usuario, error, loading } = useSelector((state) => state.login);
  const [bienvenida, setBienvenida] = useState('');
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    dispatch(loginUsuario(data));
  };

  useEffect(() => {
    if (usuario) {
      setBienvenida(`Bienvenido, ${usuario.nombre} 🎉`);
      setTimeout(() => navigate('/'), 1500);
    }
  }, [usuario, navigate]);

  useEffect(() => {
    if (error) {
      setBienvenida('⚠️ Error al iniciar sesión');
      setTimeout(() => setBienvenida(''), 3000);
    }
  }, [error]);

  // Colores originales
  const bg = useColorModeValue('gray.50', 'gray.800');
  const accent = '#8B5E3C';
  const accentHover = '#A06B46';
  const cardBg = useColorModeValue('#FFFFFF', 'gray.700');

  return (
    <Flex
      minH="100vh"
      bgGradient="linear(to-br, #F7F1ED, #EAE4DC)"
      align="center"
      justify="center"
      px={4}
    >
      <Fade in={true} delay={0.2}>
        <Box
          bg={cardBg}
          p={[6, 8, 10]}
          borderRadius="2xl"
          boxShadow="2xl"
          w="full"
          maxW="md"
        >
          <Heading
            textAlign="center"
            fontSize={['2xl', '3xl']}
            mb={6}
            color={accent}
          >
            Iniciar Sesión
          </Heading>

          <Fade in={!!bienvenida}>
            {bienvenida && (
              <Text
                textAlign="center"
                color={bienvenida.includes('Error') ? 'red.500' : 'green.600'}
                mb={4}
                fontWeight="semibold"
                px={2}
              >
                {bienvenida}
              </Text>
            )}
          </Fade>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={5}>
              {/* Usuario */}
              <FormControl isInvalid={!!errors.nombre}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.400">
                    <FiUser />
                  </InputLeftElement>
                  <Input
                    placeholder="Nombre de usuario"
                    {...register('nombre')}
                    focusBorderColor={accent}
                    bg="gray.50"
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.nombre && errors.nombre.message}
                </FormErrorMessage>
              </FormControl>

              {/* Contraseña */}
              <FormControl isInvalid={!!errors.contrasena}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.400">
                    <FiLock />
                  </InputLeftElement>
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Contraseña"
                    {...register('contrasena')}
                    focusBorderColor={accent}
                    bg="gray.50"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon={showPass ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowPass((s) => !s)}
                      aria-label="Mostrar contraseña"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.contrasena && errors.contrasena.message}
                </FormErrorMessage>
              </FormControl>

              {/* Botón */}
              <Button
                type="submit"
                w="full"
                bg={accent}
                color="white"
                _hover={{ bg: accentHover }}
                isLoading={loading}
                loadingText="Validando..."
                size="lg"
                borderRadius="md"
              >
                Entrar
              </Button>
            </VStack>
          </form>

          <Text
            textAlign="center"
            mt={6}
            fontSize="sm"
            color="gray.500"
            opacity={0.8}
          >
            ¿No tienes cuenta? Contacta al administrador.
          </Text>
        </Box>
      </Fade>
    </Flex>
  );
}
