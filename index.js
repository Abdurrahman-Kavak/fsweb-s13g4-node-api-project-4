require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(cors());

const users = [];
let idCounter = 1;

app.post("/api/kayıtol", (req, res) => {
  const { kullaniciadi, sifre } = req.body;

  if (!kullaniciadi || !sifre) {
    return res
      .status(400)
      .json({ message: "Kullanıcı adı ve şifre gereklidir" });
  }

  const existingUser = users.find((u) => u.kullaniciadi === kullaniciadi);
  if (existingUser) {
    return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış" });
  }

  const hashedPassword = bcrypt.hashSync(sifre, 8);

  const newUser = {
    id: idCounter++,
    kullaniciadi,
    sifre: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({ id: newUser.id, kullaniciadi: newUser.kullaniciadi });
});

app.post("/api/giriş", (req, res) => {
  const { kullaniciadi, sifre } = req.body;

  if (!kullaniciadi || !sifre) {
    return res
      .status(400)
      .json({ message: "Kullanıcı adı ve şifre gereklidir" });
  }

  const user = users.find((u) => u.kullaniciadi === kullaniciadi);
  if (!user) {
    return res.status(401).json({ message: "Geçersiz giriş bilgileri" });
  }

  const isPasswordValid = bcrypt.compareSync(sifre, user.sifre);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Geçersiz giriş bilgileri" });
  }

  res.status(200).json({ message: `Hoş geldin, ${user.kullaniciadi}!` });
});

app.get("/api/kullanıcılar", (req, res) => {
  res.json(users);
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
