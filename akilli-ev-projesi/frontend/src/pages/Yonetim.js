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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Yonetim() {
  const navigate = useNavigate();
  const toast = useToast();

  // Hook'lar her zaman en üstte, koşulsuz
  const [evler, setEvler] = useState([]);
  const [odalar, setOdalar] = useState([]);

  const [yeniEv, setYeniEv] = useState({ ev_adi: '', adres: '' });
  const [yeniOda, setYeniOda] = useState({ ev_id: '', oda_adi: '' });
  const [yeniCihaz, setYeniCihaz] = useState({ ev_id: '', oda_id: '', cihaz_adi: '', cihaz_tipi: '' });

  const kullaniciStr = localStorage.getItem('kullanici');
  const kullanici = kullaniciStr ? JSON.parse(kullaniciStr) : null;

  const fetchEvler = async () => {
    try {
      const res = await fetch(`http://localhost:3001/evler/${kullanici.kullanici_id}`);
      const data = await res.json();
      setEvler(data);
    } catch (error) {
      toast({
        title: 'Evler yüklenirken hata oluştu.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const fetchOdalar = async (ev_id) => {
    try {
      const res = await fetch(`http://localhost:3001/odalar/${ev_id}`);
      const data = await res.json();
      setOdalar(data);
    } catch {
      toast({
        title: 'Odalar yüklenirken hata oluştu.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (kullanici) {
      fetchEvler();
    }
  }, [kullanici]);

  if (!kullanici) return <Box p={6}>Lütfen giriş yapınız.</Box>;

  const handleEvEkle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/ev-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...yeniEv, kullanici_id: kullanici.kullanici_id }),
      });

      if (res.ok) {
        setYeniEv({ ev_adi: '', adres: '' });
        fetchEvler();
        toast({
          title: 'Ev başarıyla eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Ev eklenirken hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOdaEkle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/oda-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yeniOda),
      });

      if (res.ok) {
        setYeniOda({ ev_id: yeniOda.ev_id, oda_adi: '' });
        fetchOdalar(yeniOda.ev_id);
        toast({
          title: 'Oda başarıyla eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Oda eklenirken hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCihazEkle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/cihaz-ekle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yeniCihaz),
      });

      if (res.ok) {
        setYeniCihaz({ ev_id: '', oda_id: '', cihaz_adi: '', cihaz_tipi: '' });
        toast({
          title: 'Cihaz başarıyla eklendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Cihaz eklenirken hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <Heading mb={6}>Yönetim Paneli</Heading>

      {/* Ev Ekleme */}
      <Box mb={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="gray.50">
        <Heading size="md" mb={4}>
          Ev Ekle
        </Heading>
        <form onSubmit={handleEvEkle}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Ev Adı</FormLabel>
              <Input
                placeholder="Ev Adı"
                value={yeniEv.ev_adi}
                onChange={e => setYeniEv({ ...yeniEv, ev_adi: e.target.value })}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Adres</FormLabel>
              <Input
                placeholder="Adres"
                value={yeniEv.adres}
                onChange={e => setYeniEv({ ...yeniEv, adres: e.target.value })}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Ekle
            </Button>
          </Stack>
        </form>
      </Box>

      {/* Oda Ekleme */}
      <Box mb={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="gray.50">
        <Heading size="md" mb={4}>
          Oda Ekle
        </Heading>
        <form onSubmit={handleOdaEkle}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Ev Seç</FormLabel>
              <Select
                placeholder="Ev Seç"
                value={yeniOda.ev_id}
                onChange={e => {
                  setYeniOda({ ...yeniOda, ev_id: e.target.value });
                  fetchOdalar(e.target.value);
                  setYeniCihaz(prev => ({ ...prev, ev_id: e.target.value }));
                }}
              >
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
                value={yeniOda.oda_adi}
                onChange={e => setYeniOda({ ...yeniOda, oda_adi: e.target.value })}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Ekle
            </Button>
          </Stack>
        </form>
      </Box>

      {/* Cihaz Ekleme */}
      <Box mb={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="gray.50">
        <Heading size="md" mb={4}>
          Cihaz Ekle
        </Heading>
        <form onSubmit={handleCihazEkle}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Ev Seç</FormLabel>
              <Select
                placeholder="Ev Seç"
                value={yeniCihaz.ev_id}
                onChange={e => {
                  const evId = e.target.value;
                  setYeniCihaz(prev => ({ ...prev, ev_id: evId }));
                  fetchOdalar(evId);
                }}
              >
                {evler.map(ev => (
                  <option key={ev.ev_id} value={ev.ev_id}>
                    {ev.ev_adi}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Oda Seç</FormLabel>
              <Select
                placeholder="Oda Seç"
                value={yeniCihaz.oda_id}
                onChange={e => setYeniCihaz({ ...yeniCihaz, oda_id: e.target.value })}
              >
                {odalar.map(oda => (
                  <option key={oda.oda_id} value={oda.oda_id}>
                    {oda.oda_adi}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cihaz Adı</FormLabel>
              <Input
                placeholder="Cihaz Adı"
                value={yeniCihaz.cihaz_adi}
                onChange={e => setYeniCihaz({ ...yeniCihaz, cihaz_adi: e.target.value })}
              />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Cihaz Tipi</FormLabel>
          <Input
            placeholder="Cihaz Tipi"
            value={yeniCihaz.cihaz_tipi}
            onChange={e => setYeniCihaz({ ...yeniCihaz, cihaz_tipi: e.target.value })}
          />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Ekle
        </Button>
      </Stack>
    </form>
  </Box>

  <Button mt={4} colorScheme="gray" onClick={() => navigate('/dashboard')}>
    Dashboard'a Git
  </Button>
</Box>
);
}

export default Yonetim;