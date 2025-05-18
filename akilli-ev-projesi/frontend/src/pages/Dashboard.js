import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/tr';
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Flex,
  Spacer,
  List,
  ListItem,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdPowerSettingsNew } from 'react-icons/md';

dayjs.extend(relativeTime);
dayjs.locale('tr');

function Dashboard() {
  const kullanici = JSON.parse(localStorage.getItem('kullanici') || '{}');
  const [evler, setEvler] = useState([]);
  const [odalar, setOdalar] = useState({});
  const [loadingOdalar, setLoadingOdalar] = useState({});
  const [expandedEvId, setExpandedEvId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!kullanici.kullanici_id) return; // Kullanıcı yoksa fetch yapma

    const fetchEvler = async () => {
      try {
        const res = await fetch(`http://localhost:3001/evler/${kullanici.kullanici_id}`);
        if (!res.ok) throw new Error('Evler alınamadı');
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
    fetchEvler();
  }, [kullanici.kullanici_id, toast]);

  // Accordion açıldığında odaları yükle
  const handleAccordionChange = (indexes) => {
    // indexes array veya number olabilir (allowToggle true)
    // Biz tek seçimli kabul edip number olarak alıyoruz.
    let evId = null;
    if (typeof indexes === 'number' && indexes !== -1) {
      evId = evler[indexes]?.ev_id;
    }

    setExpandedEvId(evId);

    if (evId && !odalar[evId] && !loadingOdalar[evId]) {
      setLoadingOdalar(prev => ({ ...prev, [evId]: true }));
      fetch(`http://localhost:3001/odalar-ve-cihazlar/${evId}`)
        .then(res => {
          if (!res.ok) throw new Error('Odalar alınamadı');
          return res.json();
        })
        .then(data => {
          setOdalar(prev => ({ ...prev, [evId]: data }));
        })
        .catch(() => {
          toast({
            title: 'Odalar yüklenirken hata oluştu.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        })
        .finally(() => {
          setLoadingOdalar(prev => ({ ...prev, [evId]: false }));
        });
    }
  };

  const handleCihazDurumDegistir = async (evId, odaId, cihaz) => {
    const yeniDurum = !cihaz.durum;
    try {
      const res = await fetch(`http://localhost:3001/cihaz/${cihaz.cihaz_id}/durum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durum: yeniDurum }),
      });

      if (res.ok) {
        const guncellenenCihaz = await res.json();
        setOdalar(prev => ({
          ...prev,
          [evId]: prev[evId].map(odaItem => {
            if (odaItem.oda_id !== odaId) return odaItem;
            return {
              ...odaItem,
              cihazlar: odaItem.cihazlar.map(c =>
                c.cihaz_id === cihaz.cihaz_id ? guncellenenCihaz : c
              ),
            };
          }),
        }));
        toast({
          title: 'Cihaz durumu başarıyla güncellendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Güncelleme başarısız');
      }
    } catch {
      toast({
        title: 'Cihaz durumu güncellenemedi.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kullanici');
    navigate('/login');
  };

  if (!kullanici.kullanici_id) {
    return (
      <Box p={6} maxW="container.lg" mx="auto">
        <Text>Giriş yapılmamış. Lütfen <Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>giriş yapınız</Button>.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="container.lg" mx="auto">
      <Flex align="center" mb={6}>
        <Heading size="lg">
          Hoş geldin, {kullanici.ad} {kullanici.soyad}
        </Heading>
        <Spacer />
        <Button colorScheme="blue" mr={3} onClick={() => navigate('/yonetim')}>
          Yönetim Paneline Git
        </Button>
        <Button colorScheme="red" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </Flex>

      {evler.length === 0 ? (
        <Text>Ev bulunamadı.</Text>
      ) : (
        <Accordion allowToggle index={evler.findIndex(e => e.ev_id === expandedEvId)} onChange={handleAccordionChange}>
          {evler.map(ev => (
            <AccordionItem key={ev.ev_id} border="1px" borderColor="gray.200" borderRadius="md" mb={4}>
              <h2>
                <AccordionButton _expanded={{ bg: 'blue.100' }}>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    {ev.ev_adi} - {ev.adres}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {loadingOdalar[ev.ev_id] ? (
                  <Spinner />
                ) : odalar[ev.ev_id] && odalar[ev.ev_id].length > 0 ? (
                  <VStack align="stretch" spacing={4}>
                    {odalar[ev.ev_id].map(oda => (
                      <Box
                        key={oda.oda_id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="sm"
                        bg="gray.50"
                      >
                        <Heading size="md" mb={3}>
                          {oda.oda_adi}
                        </Heading>

                        {oda.cihazlar.map(cihaz => (
                          <Flex
                            key={cihaz.cihaz_id}
                            align="center"
                            justify="space-between"
                            mb={2}
                            p={2}
                            bg="white"
                            borderRadius="md"
                            boxShadow="xs"
                          >
                            <Box>
                              <Text fontWeight="semibold">
                                {cihaz.cihaz_adi} <Badge colorScheme="purple">{cihaz.cihaz_tipi}</Badge>
                              </Text>
                              <Text fontSize="sm" color={cihaz.durum ? 'green.600' : 'red.600'}>
                                Durum: {cihaz.durum ? 'Açık' : 'Kapalı'}
                              </Text>

                              {cihaz.sensorler && cihaz.sensorler.length > 0 && (
                                <List spacing={1} mt={2} fontSize="sm" color="gray.600">
                                  {cihaz.sensorler.map(sensor => (
                                    <ListItem key={sensor.sensor_id}>
                                      {sensor.sensor_tipi}: {sensor.deger} ({dayjs(sensor.olcum_zamani).fromNow()})
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </Box>
                            <Button
                              leftIcon={<MdPowerSettingsNew />}
                              colorScheme={cihaz.durum ? 'red' : 'green'}
                              size="sm"
                              onClick={() => handleCihazDurumDegistir(ev.ev_id, oda.oda_id, cihaz)}
                            >
                              {cihaz.durum ? 'Kapat' : 'Aç'}
                            </Button>
                          </Flex>
                        ))}
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text>Bu evde oda bulunmamaktadır.</Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
}

export default Dashboard;
