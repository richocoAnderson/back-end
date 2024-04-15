const mahasiswa = require('../controller/mahasiswa');

async function addMahasiswa(req, res) {
  const { nim, nama, jurusan,  jenisKelamin } = req.body;
  const result = await mahasiswa.createMahasiswa({ nim, nama, jurusan, jenisKelamin });
  if (result.error) {
    return res.status(400).json({ message: result.error });
  } else {
    return res.status(200).json({ message: result.message });
  }
}

async function displayAllMahasiswa(req, res) {
  try {
    const mahasiswaList = await mahasiswa.displayAllMahasiswa();
    res.status(200).json(mahasiswaList);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menampilkan mahasiswa', errorMessage: error.message });
  }
}

module.exports = {
    addMahasiswa,
    displayAllMahasiswa
  };