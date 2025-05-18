const pool = require('../db');

// Tüm kullanıcıları getir
const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kullanici_gorunum');
    res.json(result.rows);
  } catch (err) {
    console.error('Kullanıcıları getirme hatası:', err.message);
    res.status(500).send('Kullanıcılar alınamadı');
  }
};

// Yeni kullanıcı ekle
const addUser = async (req, res) => {
  const { ad, soyad, email, sifre, rol } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO kullanici (ad, soyad, email, sifre, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ad, soyad, email, sifre, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Kullanıcı ekleme hatası:', err.message);
    res.status(500).send('Kullanıcı eklenemedi');
  }
};

// Kullanıcı sil
const deleteUser = async (req, res) => {
  const { kullanici_id } = req.params;
  try {
    await pool.query('DELETE FROM kullanici WHERE kullanici_id = $1', [kullanici_id]);
    res.status(200).send('Kullanıcı silindi');
  } catch (err) {
    console.error('Kullanıcı silme hatası:', err.message);
    res.status(500).send('Kullanıcı silinemedi');
  }
};

module.exports = {
  getUsers,
  addUser,
  deleteUser
};
