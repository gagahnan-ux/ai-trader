const express = require("express");
const app = express();

// 🔥 IMPORTANT: raw text dulu (bukan json)
app.use(express.text());

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("AI SERVER RUNNING 🚀");
});

// ================= SIGNAL =================
app.get("/signal", (req, res) => {
  res.json({ signal: "BUY" });
});

// ================= AI RECEIVE DATA =================
app.post("/data", (req, res) => {
  try {
    console.log("RAW DATA:", req.body);

    // try parse JSON manually
    let clean = req.body.trim();

    // fix kalau double JSON
    if (clean.includes("}{")) {
      clean = clean.split("}")[0] + "}";
    }

    const data = JSON.parse(clean);

    console.log("PARSED:", data);

    res.json({
      signal: "BUY"
    });

  } catch (err) {
    console.log("JSON ERROR:", err.message);

    // fallback signal (elak EA freeze)
    res.json({
      signal: "HOLD"
    });
  }
});

// ================= START =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});