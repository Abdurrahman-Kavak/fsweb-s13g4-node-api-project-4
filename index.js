require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(cors());

const users = [];
let idCounter = 1;

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Kullanıcı adı ve şifre gereklidir" });
  }

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = {
    id: idCounter++,
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({ id: newUser.id, username: newUser.username });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Kullanıcı adı ve şifre gereklidir" });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Geçersiz giriş bilgileri" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Geçersiz giriş bilgileri" });
  }

  res.status(200).json({ message: `Hoş geldin, ${user.username}!` });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
