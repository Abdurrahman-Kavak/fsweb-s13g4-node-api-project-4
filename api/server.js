const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const kayitOlValidation = require("./middleware/kayitol.js");

const server = express();

server.use(express.json());
server.use(cors());

const users = [];

server.get("/api/kullanicilar", (req, res) => {
  res.status(200).json(users);
});

server.post("/api/kayitol", kayitOlValidation, (req, res) => {
  const { kullaniciadi, sifre } = req.body;

  const hashedPassword = bcrypt.hashSync(sifre, 8);

  const newUser = {
    id: users.length + 1,
    kullaniciadi,
    sifre: hashedPassword,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

server.post("/api/giris", (req, res) => {
  const { kullaniciadi, sifre } = req.body;

  if (!kullaniciadi || !sifre) {
    return res
      .status(400)
      .json({ message: "kullaniciadi ve sifre gereklidir" });
  }

  const user = users.find((u) => u.kullaniciadi === kullaniciadi);

  if (user && bcrypt.compareSync(sifre, user.sifre)) {
    res.status(200).json({ message: `Hoşgeldin, ${user.kullaniciadi}!` });
  } else {
    res.status(401).json({ message: "Geçersiz giriş bilgileri" });
  }
});

module.exports = server;
