const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Middleware = require('./middleware/middleware');
const KRS = require('./controller/krs');

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your React app's domain
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
  app.use(cors(corsOptions));
app.use(Middleware);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

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
