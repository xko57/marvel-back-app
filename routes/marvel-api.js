const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
  try {
    let { search, skip, limit } = req.query;
    let filter = "";

    if (search) {
      filter = `&name=${req.query.search}`;
    }

    if (!skip || skip < 1) {
      skip = 1;
    }
    filter = `${filter}&skip=${skip}`;

    if (!limit || limit < 20) {
      limit = 100;
    }
    filter = `${filter}&limit=${limit}`;
    console.log(
      `${process.env.MARVEL_URI_BASE}/characters?apiKey=${process.env.MARVEL_API_KEY}${filter}`
    );
    const response = await axios.get(
      `${process.env.MARVEL_URI_BASE}/characters?apiKey=${process.env.MARVEL_API_KEY}${filter}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/character/:id/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.MARVEL_URI_BASE}/comics/${req.params.id}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/comics", async (req, res) => {
  try {
    let { search, skip, limit } = req.query;
    let filter = "";

    if (search) {
      filter = `&title=${req.query.search}`;
    }

    if (!skip || skip < 1) {
      skip = 1;
    }
    filter = `${filter}&skip=${skip}`;

    if (!limit || limit < 20) {
      limit = 100;
    }
    filter = `${filter}&limit=${limit}`;

    const response = await axios.get(
      `${process.env.MARVEL_URI_BASE}/comics?apiKey=${process.env.MARVEL_API_KEY}${filter}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
