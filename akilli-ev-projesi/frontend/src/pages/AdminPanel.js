import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  useToast,
  Divider,
  Text,
  Flex,
} from '@chakra-ui/react';
import EvPanel from '../EvPanel';
import OdaPanel from '../OdaPanel';
import CihazPanel from '../CihazPanel';
import SensorPanel from '../SensorPanel';

function AdminPanel() {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [form, setForm] = useState({
    ad: '',
    soyad: '',
    email: '',
    sifre: '',
    rol: 'user',
  });

  const toast = useToast();
  const kullanici = JSON.parse(localStorage.getItem('kullanici'));
  const adminKullaniciId = kullanici?.kullanici_id;

  useEffect(() => {
    fetchKullanicilar();
  }, []);

  const fetchKullanicilar = async () => {
    try {
      const res = await fetch('http://localhost:3001/kullanicilar');
      const data = await res.json();
      setKullanicilar(data);
    } catch (err) {
      toast({
        title: 'Kullanıcılar getirilemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEkle = async () => {
    try {
      const res = await fetch('http://localhost:3001/kullanici-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast({
          title: 'Kullanıcı eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm({ ad: '', soyad: '', email: '', sifre: '', rol: 'user' });
        fetchKullanicilar();
      } else {
        toast({
          title: 'Ekleme başarısız.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Ekleme hatası.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSil = async (id) => {
    if (!window.confirm('Kullanıcı silinsin mi?')) return;

    try {
      const res = await fetch(`http://localhost:3001/kullanici-sil/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Kullanıcı silindi.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        fetchKullanicilar();
      } else {
        toast({
          title: 'Silme başarısız.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Silme hatası.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxW="container.lg" mx="auto">
      <Heading mb={6}>Admin Panel</Heading>

      {/* Yeni Kullanıcı Ekleme */}
      <Box mb={8} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
        <Heading size="md" mb={4}>
          Yeni Kullanıcı Ekle
        </Heading>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Ad</FormLabel>
            <Input
              placeholder="Ad"
              value={form.ad}
              onChange={(e) => setForm({ ...form, ad: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Soyad</FormLabel>
            <Input
              placeholder="Soyad"
              value={form.soyad}
              onChange={(e) => setForm({ ...form, soyad: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Şifre</FormLabel>
            <Input
              type="password"
              placeholder="Şifre"
              value={form.sifre}
              onChange={(e) => setForm({ ...form, sifre: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Rol</FormLabel>
            <Select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" onClick={handleEkle}>
            Kullanıcı Ekle
          </Button>
        </Stack>
      </Box>

      {/* Kullanıcı Listesi */}
      <Box mb={8} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
        <Heading size="md" mb={4}>
          Mevcut Kullanıcılar
        </Heading>
        <Stack spacing={3}>
          {kullanicilar.map((k) => (
            <Flex
              key={k.kullanici_id}
              justify="space-between"
              align="center"
              p={2}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text>
                {k.ad} {k.soyad} (ID: {k.kullanici_id}) - {k.email} - Rol: {k.rol}
              </Text>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => handleSil(k.kullanici_id)}
              >
                Sil
              </Button>
            </Flex>
          ))}
        </Stack>
      </Box>

      <Divider my={6} />
      {/* Diğer Paneller */}
      <EvPanel />
      <OdaPanel kullaniciId={adminKullaniciId} />
      <CihazPanel />
      <SensorPanel />
    </Box>
  );
}

export default AdminPanel;
