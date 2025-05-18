const express = require('express');
const router = express.Router();
const odaController = require('../controllers/odaController');

router.post('/oda-ekle', odaController.odaEkle);
router.get('/odalar', odaController.odalar);
router.delete('/oda-sil/:id', odaController.odaSil);
router.get('/odalar-tumu', odaController.tumOdalar);

module.exports = router;
