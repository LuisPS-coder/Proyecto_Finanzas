require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Lista blanca para CORS
const whitelist = [
  'http://localhost:5173',
  'https://proyecto-finanzas.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Middlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Configuración adicional
require('./config/passport');
require('./config/cloudinary');

// Ruta base para todas las rutas definidas en routes/index.js
app.use("/api", require("./routes"));

// Logs de verificación
console.log("🌍 Puerto:", process.env.PORT);
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL);

// Inicio del servidor
app.listen(port, () => {
  console.log(`✅ App listening on port ${port}`);
});
