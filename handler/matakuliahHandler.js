const MK = require('../controller/matakuliah');

async function addMatakuliah(req, res) {
  const { mataKuliah, sks, jenisMk, semesterMk } = req.body;
  const result = await MK.createMatakuliah({ mataKuliah, sks, jenisMk, semesterMk });
  if (result.error) {
    return res.status(400).json({ message: result.error });
  } else {
    return res.status(200).json({ message: result.message });
  }
}

async function DisplayAllMatakuliah(req, res) {
  try {
    const matakuliahList = await MK.displayAllMatakuliah();
    res.status(200).json(matakuliahList);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menampilkan matakuliah', errorMessage: error.message });
  }
}



module.exports = {
    addMatakuliah,
    DisplayAllMatakuliah
  };