const KRS = require('../controller/krs');

async function addKRS(req, res) {
  const {kodeMk, semesterKRS, nim, nilai, sks } = req.body;
  const result = await KRS.createKRS({kodeMk, semesterKRS, nim, nilai, sks });
  if (result.error) {
    return res.status(400).json({ message: result.error });
  } else {
    return res.status(200).json({ message: result.message });
  }
}

async function getAllIPK(req, res) {
  try {
      // Panggil controller untuk mendapatkan IPK semua mahasiswa
      const ipkList = await KRS.getAllIPK();

      res.status(200).json(ipkList);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

async function getIPKByNIM(req, res) {
  try {
      // Panggil controller untuk mendapatkan IPK semua mahasiswa
      const nim = req.params.nim;
      const ipkList = await KRS.getIPKByNIM(nim);

      res.status(200).json(ipkList);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

module.exports = {
    addKRS,
    getAllIPK,
    getIPKByNIM
  };