const mahasiswa = require('../controller/mahasiswa');

async function addMahasiswa(req, res) {
  const { nim, nama, jurusan, semester, jenisKelamin } = req.body;
  const result = await mahasiswa.createMahasiswa({ nim, nama, jurusan, semester, jenisKelamin });
  if (result.error) {
    return res.status(400).json({ message: result.error });
  } else {
    return res.status(200).json({ message: result.message });
  }
}

module.exports = {
    addMahasiswa
  };