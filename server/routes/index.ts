import express from "express";
import path from "path";

const router = express.Router();

router.get("/health", (req, res) => {
  res.send("ok");
});

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

export default router;
