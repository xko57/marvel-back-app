const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middleware/isAuthenticated");
const axios = require("axios");

const User = require("../models/User");
const Favori = require("../models/Favori");

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized connection, check your email and/or password",
      });
    }

    const hashUserLogin = SHA256(password + user.salt).toString(encBase64);

    if (hashUserLogin === user.hash) {
      const token = uid2(parseInt(process.env.TOKEN_LENGTH));
      user.token = token;

      await User.updateOne({ token: token });

      return res.status(200).json({
        _id: user._id,
        email: user.email,
        pseudo: user.pseudo,
        token: token,
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized connection, check your email and/or password",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/signup", async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;
    console.log(pseudo, email, password);

    if (pseudo && email && password) {
      const userEmail = await User.findOne({ email: email });

      if (userEmail) {
        return res.status(400).json({ message: "email already used" });
      }

      const password = req.body.password;
      const salt = uid2(parseInt(process.env.SALT_LENGTH));
      const hash = SHA256(password + salt).toString(encBase64);
      const token = uid2(parseInt(process.env.TOKEN_LENGTH));

      const newUser = new User({
        email: email,
        pseudo: pseudo,
        password: password,
        salt: salt,
        hash: hash,
        token: token,
      });

      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        pseudo: newUser.pseudo,
        token: token,
      });
    }
    return res.status(428).json({ message: "Missing parameters" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/favoris", isAuthenticated, async (req, res) => {
  try {
    const favoris = await Favori.find({ owner: req.user });
    res.status(200).json(favoris);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/favori/:type/:id", isAuthenticated, async (req, res) => {
  try {
    const { type, id } = req.params;

    const favoris = await Favori.findOne({ owner: req.user, card_id: id });
    if (favoris) {
      return res
        .status(409)
        .json({ message: "Favori already exists for this card" });
    }

    const response = await axios.get(
      `${process.env.MARVEL_URI_BASE}/${type}/${id}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    const datas = response.data;
    const newFavori = new Favori({
      card_id: id,
      card_type: type,
      card_name: datas.title || datas.name,
      card_thumbnail: datas.thumbnail,
      card_description: datas.description || null,
      owner: req.user,
    });
    await newFavori.save();

    return res.status(201).json(newFavori);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
