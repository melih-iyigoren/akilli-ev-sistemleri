import React, { useState, useEffect } from 'react';
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
  Flex,
  Text,
} from '@chakra-ui/react';

function OdaPanel() {
  const [odalar, setOdalar] = useState([]);
  const [evler, setEvler] = useState([]);
  const [form, setForm] = useState({
    ev_id: '',
    oda_adi: '',
  });

  const toast = useToast();

  useEffect(() => {
    fetchEvler();
    fetchOdalar();
  }, []);

  const fetchEvler = async () => {
    try {
      const res = await fetch(`http://localhost:3001/tum-evler`);
      const data = await res.json();
      setEvler(data);
      if (data.length > 0) setForm(f => ({ ...f, ev_id: data[0].ev_id }));
    } catch (err) {
      toast({
        title: 'Evler getirilemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchOdalar = async () => {
    try {
      const res = await fetch('http://localhost:3001/odalar');
      const data = await res.json();
      setOdalar(data);
    } catch (err) {
      toast({
        title: 'Odalar getirilemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEkle = async () => {
    if (!form.oda_adi || !form.ev_id) {
      toast({
        title: 'Lütfen oda adı ve ev seçiniz.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/oda-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast({
          title: 'Oda eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm(f => ({ ...f, oda_adi: '' }));
        fetchOdalar();
      } else {
        toast({
          title: 'Oda ekleme başarısız.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Oda ekleme hatası.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSil = async (odaId) => {
    if (!window.confirm('Oda silinsin mi?')) return;

    try {
      const res = await fetch(`http://localhost:3001/oda-sil/${odaId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Oda silindi.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        fetchOdalar();
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
    <Box mt={10} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
      <Heading size="md" mb={4}>
        Oda Yönetimi
      </Heading>

      <Stack spacing={3} mb={6}>
        <FormControl isRequired>
          <FormLabel>Ev Seçin</FormLabel>
          <Select
            value={form.ev_id}
            onChange={e => setForm({ ...form, ev_id: e.target.value })}
          >
            <option value="">Ev Seçin</option>
            {evler.map(ev => (
              <option key={ev.ev_id} value={ev.ev_id}>
                {ev.ev_adi}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Oda Adı</FormLabel>
          <Input
            placeholder="Oda Adı"
            value={form.oda_adi}
            onChange={e => setForm({ ...form, oda_adi: e.target.value })}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleEkle}>
          Ekle
        </Button>
      </Stack>

      <Heading size="sm" mb={3}>
        Mevcut Odalar
      </Heading>
      <Stack spacing={3}>
        {odalar.map(oda => (
          <Flex
            key={oda.oda_id}
            justify="space-between"
            align="center"
            p={2}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
          >
            <Text>
              {oda.oda_adi} (Ev: {oda.ev_adi}, Kullanıcı: {oda.kullanici_ad} {oda.kullanici_soyad})
            </Text>
            <Button size="sm" colorScheme="red" onClick={() => handleSil(oda.oda_id)}>
              Sil
            </Button>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export default OdaPanel;
