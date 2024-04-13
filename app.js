const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Middleware = require('./middleware/middleware');

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
