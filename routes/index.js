const express = require('express');
const router = express.Router();
const authController = require('../handler/authenticationControllers');
const MahasiswaController = require('../handler/mahasiswaHandler');
const matakuliahController = require('../handler/matakuliahHandler');
const krsController = require('../handler/krsHandler');


// Rute untuk pendaftaran pengguna
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/addMahasiswa', MahasiswaController.addMahasiswa);
router.post('/addMatakuliah', matakuliahController.addMatakuliah);
router.post('/addKRS', krsController.addKRS);
router.get('/getAllIPK',krsController.getAllIPK);
router.get('/getIPK/:nim', krsController.getIPKByNIM);



module.exports = router;
