const express = require('express');
const router = express.Router();
const { getUsers, addUser, deleteUser } = require('../controllers/userController');

router.get('/kullanicilar', getUsers);
router.post('/kullanici-ekle', addUser);
router.delete('/kullanici-sil/:kullanici_id', deleteUser);

router.get('/kullanicilar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kullanici');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: 'Kullanıcılar alınamadı' });
  }
});


module.exports = router;
