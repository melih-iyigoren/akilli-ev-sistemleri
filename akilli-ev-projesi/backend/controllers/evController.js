const pool = require('../db');

exports.tumEvler = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ev_detay');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Tüm evler getirilemedi' });
  }
};

exports.evleriGetir = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ev');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Evleri getirirken hata oluştu' });
  }
};

exports.evEkle = async (req, res) => {
  const { kullanici_id, ev_adi, adres } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ev (kullanici_id, ev_adi, adres) VALUES ($1, $2, $3) RETURNING *',
      [kullanici_id, ev_adi, adres]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ev eklenemedi' });
  }
};

exports.evSil = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ev WHERE ev_id = $1', [id]);
    res.json({ message: 'Ev silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ev silinemedi' });
  }
};
