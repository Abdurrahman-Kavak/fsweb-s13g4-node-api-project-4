function kayitOlValidation(req, res, next) {
  const { kullaniciadi, sifre } = req.body;

  if (!kullaniciadi || !sifre) {
    return res
      .status(400)
      .json({ message: "kullaniciadi ve sifre gereklidir" });
  }

  next();
}

module.exports = kayitOlValidation;
