// routes/sensorRouter.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Sensör ekleme
router.post('/sensor-ekle', sensorController.sensorEkle);

// Sensörleri listeleme
router.get('/sensorler', sensorController.sensorler);

// Sensör silme
router.delete('/sensor-sil/:id', sensorController.sensorSil);

module.exports = router;
