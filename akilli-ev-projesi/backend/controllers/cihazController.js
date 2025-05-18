const pool = require('../db');

// Cihaz ekle
exports.cihazEkle = async (req, res) => {
  const { oda_id, cihaz_adi, cihaz_tipi } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cihaz (oda_id, cihaz_adi, cihaz_tipi, durum) VALUES ($1, $2, $3, $4)',
       [oda_id, cihaz_adi, cihaz_tipi, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cihaz eklenemedi' });
  }
};

// Cihazları listele (evler, odalar, kullanıcı bilgileri ile birlikte)
exports.cihazlar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cihaz_detay');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cihazlar getirilemedi' });
  }
};

// Cihaz sil
exports.cihazSil = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cihaz WHERE cihaz_id = $1', [id]);
    res.json({ message: 'Cihaz silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cihaz silinemedi' });
  }
};
