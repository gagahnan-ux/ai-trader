const express = require("express");
const app = express();

app.use(express.json());

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("AI SERVER RUNNING ✅");
});

// ================= SIGNAL =================
app.get("/signal", (req, res) => {
  res.send("BUY");
});

// ================= UPDATE =================
app.post("/update", (req, res) => {
  console.log("DATA MASUK:", req.body);
  res.json({ status: "ok" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT", PORT);
});