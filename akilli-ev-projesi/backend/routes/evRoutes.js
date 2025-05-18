const express = require('express');
const router = express.Router();
const evController = require('../controllers/evController');

router.get('/tum-evler', evController.tumEvler);
router.get('/evler', evController.evleriGetir);
router.post('/ev-ekle', evController.evEkle);
router.delete('/ev-sil/:id', evController.evSil);

module.exports = router;
