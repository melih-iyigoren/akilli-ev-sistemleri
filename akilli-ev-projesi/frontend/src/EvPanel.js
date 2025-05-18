import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';

function EvPanel() {
  const [evler, setEvler] = useState([]);
  const [form, setForm] = useState({
    kullanici_id: '',
    adres: '',
    ev_adi: '',
  });

  const toast = useToast();

  useEffect(() => {
    fetchEvler();
  }, []);

  const fetchEvler = async () => {
    try {
      const res = await fetch('http://localhost:3001/evler');
      const data = await res.json();
      setEvler(data);
    } catch (err) {
      toast({
        title: 'Evler getirilemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEkle = async () => {
    try {
      const res = await fetch('http://localhost:3001/ev-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast({
          title: 'Ev eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm({ kullanici_id: '', adres: '', ev_adi: '' });
        fetchEvler();
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
        title: 'Ev eklenemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSil = async (id) => {
    if (!window.confirm('Bu evi silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`http://localhost:3001/ev-sil/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Ev silindi.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        fetchEvler();
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
        title: 'Ev silinemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mt={10} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
      <Heading size="md" mb={4}>
        Ev Yönetimi
      </Heading>

      <Stack spacing={3} mb={6}>
        <FormControl isRequired>
          <FormLabel>Kullanıcı ID</FormLabel>
          <Input
            type="number"
            placeholder="Kullanıcı ID"
            value={form.kullanici_id}
            onChange={(e) => setForm({ ...form, kullanici_id: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Adres</FormLabel>
          <Input
            placeholder="Adres"
            value={form.adres}
            onChange={(e) => setForm({ ...form, adres: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Ev Adı</FormLabel>
          <Input
            placeholder="Ev Adı"
            value={form.ev_adi}
            onChange={(e) => setForm({ ...form, ev_adi: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleEkle}>
          Ekle
        </Button>
      </Stack>

      <Heading size="sm" mb={3}>
        Mevcut Evler
      </Heading>
      <Stack spacing={3}>
        {evler.map((ev) => (
          <Flex
            key={ev.ev_id}
            justify="space-between"
            align="center"
            p={2}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
          >
            <Text>
              {ev.ev_adi} - {ev.adres} (Kullanıcı ID: {ev.kullanici_id})
            </Text>
            <Button size="sm" colorScheme="red" onClick={() => handleSil(ev.ev_id)}>
              Sil
            </Button>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export default EvPanel;
