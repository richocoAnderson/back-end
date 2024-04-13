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

module.exports = {
    addMatakuliah
  };