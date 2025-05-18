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
  Flex,
  Text,
} from '@chakra-ui/react';

function CihazPanel() {
  const [cihazlar, setCihazlar] = useState([]);
  const [odalar, setOdalar] = useState([]);
  const [form, setForm] = useState({
    oda_id: '',
    cihaz_adi: '',
    cihaz_tipi: '',
  });

  const toast = useToast();

  useEffect(() => {
    fetchOdalar();
    fetchCihazlar();
  }, []);

  const fetchOdalar = async () => {
    try {
      const res = await fetch('http://localhost:3001/odalar-tumu');
      const data = await res.json();
      setOdalar(data);
      if (data.length > 0) {
        setForm(f => ({ ...f, oda_id: data[0].oda_id }));
      }
    } catch (err) {
      toast({
        title: 'Odalar alınamadı.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchCihazlar = async () => {
    try {
      const res = await fetch('http://localhost:3001/cihazlar');
      const data = await res.json();
      setCihazlar(data);
    } catch (err) {
      toast({
        title: 'Cihazlar alınamadı.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEkle = async () => {
    if (!form.oda_id || !form.cihaz_adi) {
      toast({
        title: 'Lütfen cihaz adı ve oda seçin.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/cihaz-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast({
          title: 'Cihaz eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm(f => ({ ...f, cihaz_adi: '', cihaz_tipi: '' }));
        fetchCihazlar();
      } else {
        toast({
          title: 'Cihaz ekleme başarısız.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Cihaz ekleme hatası.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSil = async (id) => {
    if (!window.confirm('Cihaz silinsin mi?')) return;
    try {
      const res = await fetch(`http://localhost:3001/cihaz-sil/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast({
          title: 'Cihaz silindi.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        fetchCihazlar();
      } else {
        toast({
          title: 'Cihaz silinemedi.',
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
      <Heading size="md" mb={4}>Cihaz Yönetimi</Heading>

      <Stack spacing={3} mb={6}>
        <FormControl isRequired>
          <FormLabel>Oda Seçin</FormLabel>
          <Select
            value={form.oda_id}
            onChange={e => setForm({ ...form, oda_id: e.target.value })}
          >
            <option value="">Oda Seçin</option>
            {odalar.map(oda => (
              <option key={oda.oda_id} value={oda.oda_id}>
                {oda.oda_adi} (Ev: {oda.ev_adi}, Kullanıcı: {oda.ad} {oda.soyad})
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Cihaz Adı</FormLabel>
          <Input
            placeholder="Cihaz Adı"
            value={form.cihaz_adi}
            onChange={e => setForm({ ...form, cihaz_adi: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Cihaz Tipi</FormLabel>
          <Input
            placeholder="Cihaz Tipi"
            value={form.cihaz_tipi}
            onChange={e => setForm({ ...form, cihaz_tipi: e.target.value })}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleEkle}>Ekle</Button>
      </Stack>

      <Heading size="sm" mb={3}>Mevcut Cihazlar</Heading>
      <Stack spacing={3}>
        {cihazlar.map(c => (
          <Flex
            key={c.cihaz_id}
            justify="space-between"
            align="center"
            p={2}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
          >
            <Text>
              {c.cihaz_adi} (Oda: {c.oda_adi}, Ev: {c.ev_adi}, Kullanıcı: {c.ad} {c.soyad})
            </Text>
            <Button size="sm" colorScheme="red" onClick={() => handleSil(c.cihaz_id)}>
              Sil
            </Button>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export default CihazPanel;
