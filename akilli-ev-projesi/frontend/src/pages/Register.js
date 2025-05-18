import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    ad: '',
    soyad: '',
    email: '',
    sifre: '',
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/kullanici', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast({
          title: 'Kayıt başarılı!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm({ ad: '', soyad: '', email: '', sifre: '' });
      } else {
        toast({
          title: 'Kayıt başarısız.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading mb={6} textAlign="center">
        Kayıt Ol
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="ad" isRequired>
            <FormLabel>Ad</FormLabel>
            <Input
              name="ad"
              value={form.ad}
              onChange={handleChange}
              placeholder="Ad"
            />
          </FormControl>

          <FormControl id="soyad" isRequired>
            <FormLabel>Soyad</FormLabel>
            <Input
              name="soyad"
              value={form.soyad}
              onChange={handleChange}
              placeholder="Soyad"
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </FormControl>

          <FormControl id="sifre" isRequired>
            <FormLabel>Şifre</FormLabel>
            <Input
              type="password"
              name="sifre"
              value={form.sifre}
              onChange={handleChange}
              placeholder="Şifre"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Kayıt Ol
          </Button>
        </VStack>
      </form>

      <HStack justify="center" pt={4}>
        <Text>Zaten hesabınız var mı?</Text>
        <Button variant="link" colorScheme="teal" onClick={() => navigate('/login')}>
          Giriş Yap
        </Button>
      </HStack>
    </Box>
  );
}

export default Register;
