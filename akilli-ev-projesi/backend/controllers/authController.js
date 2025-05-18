const pool = require('../db');

const login = async (req, res) => {
  const { email, sifre } = req.body;
  console.log("Giriş isteği:", req.body);

  try {
    const kullanici = await pool.query(
      'SELECT * FROM kullanici WHERE email = $1 AND sifre = $2',
      [email, sifre]
    );

    if (kullanici.rows.length > 0) {
      console.log("Giriş başarılı:", kullanici.rows[0]);
      res.json({ mesaj: 'Giriş başarılı', kullanici: kullanici.rows[0] });
    } else {
      console.warn("Geçersiz giriş:", email);
      res.status(401).json({ mesaj: 'Geçersiz e-posta veya şifre' });
    }
  } catch (err) {
    console.error("Giriş hatası:", err.message);
    res.status(500).send(`Hata: ${err.message}`);
  }
};

module.exports = { login };
