// controllers/sensorController.js
const pool = require('../db');

// Sensör ekle
exports.sensorEkle = async (req, res) => {
  const { cihaz_id, sensor_tipi, deger, olcum_zamani } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sensor (cihaz_id, sensor_tipi, deger, olcum_zamani) VALUES ($1, $2, $3, $4) RETURNING *',
      [cihaz_id, sensor_tipi, deger, olcum_zamani]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sensör eklenemedi' });
  }
};

// Sensörleri listele (cihaz, oda, ev, kullanıcı bilgileriyle)
exports.sensorler = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.sensor_id, s.sensor_tipi, s.deger, s.olcum_zamani,
             c.cihaz_id, c.cihaz_adi, c.cihaz_tipi,
             o.oda_id, o.oda_adi,
             e.ev_id, e.ev_adi,
             k.kullanici_id, k.ad, k.soyad
      FROM sensor s
      JOIN cihaz c ON s.cihaz_id = c.cihaz_id
      JOIN oda o ON c.oda_id = o.oda_id
      JOIN ev e ON o.ev_id = e.ev_id
      JOIN kullanici k ON e.kullanici_id = k.kullanici_id
      ORDER BY s.sensor_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sensörler getirilemedi' });
  }
};

// Sensör sil
exports.sensorSil = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sensor WHERE sensor_id = $1', [id]);
    res.json({ message: 'Sensör silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sensör silinemedi' });
  }
};
