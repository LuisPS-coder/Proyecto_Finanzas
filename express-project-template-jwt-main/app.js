require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const whitelist = [
  'http://localhost:5173',
  'https://proyecto-finanzas.netlify.app'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

require('./config/passport');
require('./config/cloudinary');

app.use("/", require("./routes"));

console.log("🌍 Puerto:", process.env.PORT);
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
console.log("🔗 DATABASE_URL:", process.env.DATABASE_URL);

app.listen(port, () => {
  console.log(`✅ App listening on port ${port}`);
});
