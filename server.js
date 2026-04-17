const express = require("express");
const app = express();

app.use(express.json());

// ===== STATE =====
let running = true;

let accountData = {
  balance: 0,
  equity: 0,
  profit: 0,
  trades: []
};

// ===== STATUS =====
app.get("/status", (req, res) => {
  res.json({ running });
});

// ===== TOGGLE EA =====
app.get("/toggle", (req, res) => {
  running = !running;
  console.log("EA:", running);
  res.json({ running });
});

// ===== RECEIVE DATA =====
app.post("/update", (req, res) => {

  const data = req.body;

  if (!data) {
    console.log("❌ NO DATA");
    return res.send("NO DATA");
  }

  accountData = {
    balance: data.balance || 0,
    equity: data.equity || 0,
    profit: data.profit || 0,
    trades: data.trades || []
  };

  console.log("📡 DATA:", accountData);

  res.send("OK");
});

// ===== SEND DATA =====
app.get("/data", (req, res) => {
  res.json(accountData);
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 VPS AI SERVER RUNNING ON", PORT);
});