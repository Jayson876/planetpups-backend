require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const path = require("path");

const indexRoute = require("./routes/index.routes");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(`Connected Successfully. Database: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongodb", err);
  });

const app = express();

app.use(cors());
// app.use(express.json({ strict: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/tmp", express.static(path.join(__dirname, "tmp")));
// app.use(
//   cors({
//     origin: 'http://localhost:4200',
//     credentials: true,
//   })
// );
app.use(cookieParser());
app.use(
  cookieSession({
    name: "planetpupsjm",
    secret: process.env.SECRET_KEY,
    httpOnly: true,
  })
);

app.use("/api", indexRoute);

const port = process.env.PORT || 8080;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}..`)
);
