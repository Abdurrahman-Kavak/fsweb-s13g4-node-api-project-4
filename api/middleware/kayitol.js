const express = require("express");
const cors = require("cors");
const kayitOlValidation = require("../middlewrae/kayit-ol");

const server = express();
server.use(express.json());
server.use(cors());

const users = [];

server.get("/api/kullanicilar", (req, res) => {
  return res.status(200).json(users);
});

server.post("/api/kayitol", kayitOlValidation, (req, res) => {
  const user = { ...req.body };
  users.push(user);
  return res.status(201).json(user);
});

server.post("/api/giris", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return res.status(401).json({ error: "Kullanıcı adı veya şifre yanlış" });
  }
  return res.status(200).json(user);
});

module.exports = server;
