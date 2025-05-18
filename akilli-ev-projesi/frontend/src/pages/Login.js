import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  FormErrorMessage,
  useToast,
  HStack,
} from '@chakra-ui/react';

function Login() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    setHata('');
    try {
      const res = await fetch('http://localhost:3001/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sifre }),
      });

      const data = await res.json();

      if (res.ok) {
        const kullanici = data.kullanici;

        if (!kullanici || !kullanici.rol) {
          setHata('Kullanıcı rol bilgisi eksik.');
          return;
        }

        localStorage.setItem('kullanici', JSON.stringify(kullanici));
        
        toast({
          title: "Giriş başarılı.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Rol bazlı yönlendirme
        if (kullanici.rol === 'admin') {
          navigate('/admin');
        } else if (kullanici.rol === 'user') {
          navigate('/dashboard');
        } else {
          setHata('Geçersiz rol.');
        }
      } else {
        setHata(data.mesaj || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('Giriş hatası:', err);
      setHata('Sunucu hatası oluştu.');
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={12}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading mb={6} textAlign="center">Giriş Yap</Heading>
      <VStack spacing={4}>
        <FormControl isInvalid={!!hata && !email}>
          <FormLabel>E-posta</FormLabel>
          <Input
            type="email"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {hata && !email && <FormErrorMessage>E-posta zorunludur</FormErrorMessage>}
        </FormControl>

        <FormControl isInvalid={!!hata && !sifre}>
          <FormLabel>Şifre</FormLabel>
          <Input
            type="password"
            placeholder="Şifrenizi girin"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
          />
          {hata && !sifre && <FormErrorMessage>Şifre zorunludur</FormErrorMessage>}
        </FormControl>

        {hata && (email && sifre) && (
          <Text color="red.500" fontSize="sm" align="center">
            {hata}
          </Text>
        )}

        <Button colorScheme="teal" width="full" onClick={handleLogin}>
          Giriş
        </Button>

        <HStack justify="center" pt={4}>
          <Text>Hesabınız yok mu?</Text>
          <Button variant="link" colorScheme="teal" onClick={() => navigate('/register')}>
            Kayıt Ol
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Login;
