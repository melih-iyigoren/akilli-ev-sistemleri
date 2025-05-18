const express = require('express');
const router = express.Router();
const cihazController = require('../controllers/cihazController');

router.post('/cihaz-ekle', cihazController.cihazEkle);
router.get('/cihazlar', cihazController.cihazlar);
router.delete('/cihaz-sil/:id', cihazController.cihazSil);

module.exports = router;
