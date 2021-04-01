const express = require("express");
const app = express();
require("dotenv").config();
const packageInfo = require("./package.json");
require("./src/bot");

app.get("/", function (req, res) {
  res.json({
    message: "This is a GitHub Repo and User view bot",
    link: "http://t.me/gitty_bot",
    version: packageInfo.version,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
