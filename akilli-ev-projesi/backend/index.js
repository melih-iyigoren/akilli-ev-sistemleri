const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const evRoutes = require('./routes/evRoutes');
const odaRoutes = require('./routes/odaRoutes');
const cihazRouter = require('./routes/cihazRouter');
const sensorRouter = require('./routes/sensorRouter');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = 3001;

// ⛳ ÖNCE middleware'leri tanımla
app.use(cors()); // 👈 CORS en önce
app.use(express.json()); // 👈 JSON parser ikinci

// ✅ Sonra route'ları ekle
app.use('/', userRoutes);
app.use(authRoutes);
app.use('/', evRoutes);
app.use('/', odaRoutes);
app.use(cihazRouter);
app.use(sensorRouter);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Akıllı Ev API çalışıyor' });
});

// ✅ KULLANICI EKLEME
app.post('/kullanici', async (req, res) => {
  const { ad, soyad, email, sifre } = req.body;
  console.log("Kayıt isteği geldi:", req.body); // <--- EKLENDİ

  try {
    const yeniKullanici = await pool.query(
      'INSERT INTO kullanici (ad, soyad, email, sifre) VALUES ($1, $2, $3, $4) RETURNING *',
      [ad, soyad, email, sifre]
    );
    console.log("Yeni kullanıcı eklendi:", yeniKullanici.rows[0]); // <--- EKLENDİ
    res.json(yeniKullanici.rows[0]);
    } catch (err) {
    console.error("Kayıt hatası:", err); // ← tüm hatayı gösterir
    res.status(500).send(`Hata: ${err.message || err}`);
  }
});

// ✅ GİRİŞ İŞLEMİ
app.post('/giris', async (req, res) => {
  const { email, sifre } = req.body;
  console.log("Giriş isteği:", req.body); // <--- EKLENDİ

  try {
    const kullanici = await pool.query(
      'SELECT * FROM kullanici WHERE email = $1 AND sifre = $2',
      [email, sifre]
    );

    if (kullanici.rows.length > 0) {
      console.log("Giriş başarılı:", kullanici.rows[0]); // <--- EKLENDİ
      res.json({ mesaj: 'Giriş başarılı', kullanici: kullanici.rows[0] });
    } else {
      console.warn("Geçersiz giriş:", email); // <--- EKLENDİ
      res.status(401).json({ mesaj: 'Geçersiz e-posta veya şifre' });
    }
  } catch (err) {
    console.error("Giriş hatası:", err.message); // <--- EKLENDİ
    res.status(500).send(`Hata: ${err.message}`);
  }
});

// Kullanıcının evlerini getirme
app.get('/evler/:kullanici_id', async (req, res) => {
  const { kullanici_id } = req.params;
  try {
    const evler = await pool.query(
      'SELECT * FROM ev WHERE kullanici_id = $1',
      [kullanici_id]
    );
    res.json(evler.rows);
  } catch (err) {
    console.error('Evleri getirme hatası:', err.message);
    res.status(500).send('Evler alınamadı');
  }
});

app.post('/ev-ekle', async (req, res) => {
  const { ev_adi, adres, kullanici_id } = req.body;
  try {
    const yeniEv = await pool.query(
      'INSERT INTO ev (ev_adi, adres, kullanici_id) VALUES ($1, $2, $3) RETURNING *',
      [ev_adi, adres, kullanici_id]
    );
    res.json(yeniEv.rows[0]);
  } catch (err) {
    console.error("Ev ekleme hatası:", err.message);
    res.status(500).send("Ev eklenemedi");
  }
});

app.post('/oda-ekle', async (req, res) => {
  const { ev_id, oda_adi } = req.body;
  try {
    const yeniOda = await pool.query(
      'INSERT INTO oda (ev_id, oda_adi) VALUES ($1, $2) RETURNING *',
      [ev_id, oda_adi]
    );
    res.json(yeniOda.rows[0]);
  } catch (err) {
    console.error("Oda ekleme hatası:", err.message);
    res.status(500).send("Oda eklenemedi");
  }
});

app.post('/cihaz-ekle', async (req, res) => {
  const { oda_id, cihaz_adi, cihaz_tipi } = req.body;
  try {
    const yeniCihaz = await pool.query(
      'INSERT INTO cihaz (oda_id, cihaz_adi, cihaz_tipi, durum) VALUES ($1, $2, $3, $4) RETURNING *',
      [oda_id, cihaz_adi, cihaz_tipi, false] // cihaz varsayılan olarak kapalı başlar
    );
    res.json(yeniCihaz.rows[0]);
  } catch (err) {
    console.error("Cihaz ekleme hatası:", err.message);
    res.status(500).send("Cihaz eklenemedi");
  }
});


app.get('/odalar/:ev_id', async (req, res) => {
  const { ev_id } = req.params;
  try {
    const odalar = await pool.query(
      'SELECT * FROM oda WHERE ev_id = $1',
      [ev_id]
    );
    res.json(odalar.rows);
  } catch (err) {
    console.error('Odaları getirme hatası:', err.message);
    res.status(500).send('Odaları çekerken bir hata oluştu.');
  }
});

// Belirli bir odanın cihazlarını getir
app.get('/odalar/:oda_id/cihazlar', async (req, res) => {
  const { oda_id } = req.params;
  try {
    const sonuc = await pool.query(
      'SELECT * FROM cihaz WHERE oda_id = $1',
      [oda_id]
    );
    res.json(sonuc.rows);
  } catch (err) {
    console.error("Cihaz getirme hatası:", err.message);
    res.status(500).send("Cihazları getirirken hata oluştu.");
  }
});

app.get('/odalar-ve-cihazlar/:ev_id', async (req, res) => {
  const { ev_id } = req.params;

  try {
    const odalarSonuc = await pool.query(
      'SELECT * FROM oda WHERE ev_id = $1',
      [ev_id]
    );
    const odalar = odalarSonuc.rows;

    for (const oda of odalar) {
      const cihazlarSonuc = await pool.query(
        'SELECT * FROM cihaz WHERE oda_id = $1',
        [oda.oda_id]
      );
      const cihazlar = cihazlarSonuc.rows;

      for (const cihaz of cihazlar) {
        const sensorlerSonuc = await pool.query(
            'SELECT sensor_id, sensor_tipi, deger, olcum_zamani ' +
			'FROM sensor ' +
			'WHERE cihaz_id = $1 ' +
			'ORDER BY olcum_zamani DESC ' +
			'LIMIT 1',
          [cihaz.cihaz_id]
        );
        cihaz.sensorler = sensorlerSonuc.rows;
      }

      oda.cihazlar = cihazlar;
    }

    res.json(odalar);
  } catch (err) {
    console.error("Odalar ve cihazlar (sensör dahil) hatası:", err.message);
    res.status(500).send("Veri çekilirken hata oluştu.");
  }
});

// Cihaz durumunu güncelle
app.put('/cihaz/:cihaz_id/durum', async (req, res) => {
  const { cihaz_id } = req.params;
  const { durum } = req.body;

  try {
    const sonuc = await pool.query(
      'UPDATE cihaz SET durum = $1 WHERE cihaz_id = $2 RETURNING *',
      [durum, cihaz_id]
    );
    res.json(sonuc.rows[0]);
  } catch (err) {
    console.error("Cihaz durumu güncelleme hatası:", err.message);
    res.status(500).send("Cihaz güncellenemedi");
  }
});

// express route örneği
app.post('/evler', (req, res) => {
  const { kullanici_id, ev_adi } = req.body;
  if (!kullanici_id) return res.status(401).json({ hata: "Giriş yapılmamış" });

  // devam et
});




app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
