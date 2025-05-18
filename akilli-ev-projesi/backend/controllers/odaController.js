const pool = require('../db');

// Oda ekle
exports.odaEkle = async (req, res) => {
  const { ev_id, oda_adi } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO oda (ev_id, oda_adi) VALUES ($1, $2) RETURNING *',
      [ev_id, oda_adi]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Oda eklenemedi' });
  }
};

// Odaları listele (ev ve kullanıcı bilgileriyle birlikte)
exports.odalar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM oda_detay');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Odalar getirilemedi' });
  }
};



// Oda sil
exports.odaSil = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM oda WHERE oda_id = $1', [id]);
    res.json({ message: 'Oda silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Oda silinemedi' });
  }
};

exports.tumOdalar = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.oda_id, o.oda_adi, e.ev_adi, k.ad, k.soyad
	  FROM oda o
      JOIN ev e ON o.ev_id = e.ev_id
      JOIN kullanici k ON e.kullanici_id = k.kullanici_id

    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tüm odalar getirilemedi' });
  }
};

