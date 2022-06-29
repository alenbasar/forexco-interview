const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv/config");

app.use(express.json());
app.use(cors());

const verifyJWT = (req, res) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    res.send("token doesn't exist");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        res.json({ auth: false, message: "Failed to authenticate" });
      } else {
        res.json({ auth: true, message: "Authentication Successful" });
        req.id = decoded.id;
      }
    });
  }
};

// MySql Connection to Database
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "LoginDB",
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
  res.send("successful");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    async (err, result) => {
      if (err) {
        res.send({ error: err });
        console.log(err);
      }

      if (result.length > 0) {
        await bcrypt.compare(
          password,
          result[0].password,
          (error, response) => {
            if (response) {
              const id = result[0].id;
              const token = jwt.sign({ id }, process.env.JWT_SECRET);

              res.json({ auth: true, token: token, result: result });
            } else {
              console.log(error);
              res.json({
                auth: false,
                message: "Wrong username or password, try again.",
              });
            }
          }
        );
      } else {
        res.json({ auth: false, message: "User doesn't exist" });
      }
    }
  );
});

app.get("/userAuth", verifyJWT, (req, res) => {
  res.send("You are authenticated.");
});

app.listen(8000, () => {
  console.log("Server Running");
});
