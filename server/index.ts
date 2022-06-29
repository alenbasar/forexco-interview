require("dotenv/config");

import express, { Request, Response } from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());
app.use(cors());

const { JWT_SECRET, DB_HOST, DB_USER, DB_PASSWORD } = process.env;
if (!JWT_SECRET) {
  throw new Error("JWT secret missing");
}
if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
  throw new Error("Database configuration missing");
}

type UserRequest = Request & {
  id?: string;
};

const verifyJWT = (req: UserRequest, res: Response) => {
  const token = req.get("x-auth-token");

  if (!token) {
    res.send("token doesn't exist");
  } else {
    jwt.verify(token, JWT_SECRET, (error, decoded: any) => {
      if (error || !decoded) {
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
              const token = jwt.sign({ id }, JWT_SECRET);

              res.json({ auth: true, token, result });
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

app.get(
  "/userAuth",
  (req, res) => verifyJWT(req, res),
  (req, res) => res.send("You are authenticated.")
);

app.listen(8000, () => {
  console.log("Server Running");
});
