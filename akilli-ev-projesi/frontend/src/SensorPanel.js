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
  Select,
  Divider,
} from '@chakra-ui/react';

function SensorPanel() {
  const [sensorler, setSensorler] = useState([]);
  const [cihazlar, setCihazlar] = useState([]);
  const [form, setForm] = useState({
    cihaz_id: '',
    sensor_tipi: '',
    deger: '',
    olcum_zamani: ''
  });

  const toast = useToast();

  useEffect(() => {
    fetchSensorler();
    fetchCihazlar();
  }, []);

  const fetchSensorler = async () => {
    try {
      const res = await fetch('http://localhost:3001/sensorler');
      const data = await res.json();
      setSensorler(data);
    } catch (err) {
      toast({
        title: 'Sensörler getirilemedi.',
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
        title: 'Cihazlar getirilemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEkle = async () => {
    try {
      const res = await fetch('http://localhost:3001/sensor-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast({
          title: 'Sensör eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm({ cihaz_id: '', sensor_tipi: '', deger: '', olcum_zamani: '' });
        fetchSensorler();
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
    if (!window.confirm('Bu sensörü silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`http://localhost:3001/sensor-sil/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast({
          title: 'Sensör silindi.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        fetchSensorler();
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
        Sensör Yönetimi
      </Heading>

      <Stack spacing={3} mb={6}>
        <FormControl isRequired>
          <FormLabel>Cihaz Seç</FormLabel>
          <Select
            placeholder="Cihaz Seç"
            value={form.cihaz_id}
            onChange={(e) => setForm({ ...form, cihaz_id: e.target.value })}
          >
            {cihazlar.map((c) => (
              <option key={c.cihaz_id} value={c.cihaz_id}>
                {c.cihaz_adi} - {c.oda_adi} / {c.ev_adi} ({c.ad} {c.soyad})
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Sensor Tipi</FormLabel>
          <Input
            placeholder="Sensor Tipi"
            value={form.sensor_tipi}
            onChange={(e) => setForm({ ...form, sensor_tipi: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Değer</FormLabel>
          <Input
            placeholder="Değer"
            value={form.deger}
            onChange={(e) => setForm({ ...form, deger: e.target.value })}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Ölçüm Zamanı</FormLabel>
          <Input
            type="datetime-local"
            value={form.olcum_zamani}
            onChange={(e) => setForm({ ...form, olcum_zamani: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleEkle}>
          Ekle
        </Button>
      </Stack>

      <Divider my={4} />

      <Heading size="sm" mb={3}>
        Mevcut Sensörler
      </Heading>
      <Stack spacing={3}>
        {sensorler.map((s) => (
          <Flex
            key={s.sensor_id}
            justify="space-between"
            align="start"
            p={3}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            direction="column"
          >
            <Box>
              <Text fontWeight="bold">{s.sensor_tipi}</Text>
              <Text>Değer: {s.deger}</Text>
              <Text>Zaman: {new Date(s.olcum_zamani).toLocaleString()}</Text>
              <Text>
                Cihaz: {s.cihaz_adi} ({s.cihaz_tipi})<br />
                Oda: {s.oda_adi}, Ev: {s.ev_adi}<br />
                Kullanıcı: {s.ad} {s.soyad}
              </Text>
            </Box>
            <Button
              size="sm"
              colorScheme="red"
              mt={2}
              alignSelf="end"
              onClick={() => handleSil(s.sensor_id)}
            >
              Sil
            </Button>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export default SensorPanel;
