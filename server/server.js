// =====================================
// AI SCALPER PRO - FINAL SERVER
// =====================================
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// =============================
// STORE DATA FROM EA
// =============================
let marketData = {};
let stats = {
  win: 0,
  loss: 0
};

// =============================
// RECEIVE DATA FROM EA
// =============================
app.post("/data", (req, res) => {
  marketData = req.body;

  console.log("📊 DATA:", marketData);

  res.json({ status: "ok" });
});

// =============================
// AI CORE LOGIC (IMPROVED)
// =============================
function getSignal() {
  if (!marketData.price) {
    return {
      signal: "HOLD",
      confidence: 0,
      sl: 100,
      tp: 100,
      mode: "SAFE"
    };
  }

  let rsi = marketData.rsi || 50;
  let spread = marketData.spread || 10;

  let signal = "HOLD";
  let confidence = 0.5;

  // =========================
  // CORE STRATEGY (ACTIVE)
  // =========================

  // NORMAL ENTRY
  if (rsi < 35) {
    signal = "BUY";
    confidence = 0.65;
  }

  else if (rsi > 65) {
    signal = "SELL";
    confidence = 0.65;
  }

  // STRONG ENTRY
  if (rsi < 25) {
    signal = "BUY";
    confidence = 0.8;
  }

  if (rsi > 75) {
    signal = "SELL";
    confidence = 0.8;
  }

  // =========================
  // SPREAD FILTER (RELAXED)
  // =========================
  if (spread > 50) {
    signal = "HOLD";
    confidence = 0;
  }

  // =========================
  // ADAPTIVE SL TP
  // =========================
  let sl = 120;
  let tp = 90;

  if (confidence > 0.75) {
    sl = 150;
    tp = 120;
  }

  // =========================
  // MODE SYSTEM
  // =========================
  let mode = "SAFE";

  if (confidence >= 0.6) mode = "SCALP";
  if (confidence >= 0.8) mode = "KILL";

  // =========================
  // LEARNING EFFECT (SIMPLE)
  // =========================
  let winRate = stats.win / Math.max(1, (stats.win + stats.loss));

  if (winRate < 0.4) {
    confidence *= 0.8; // defensive mode
  }

  if (winRate > 0.7) {
    confidence *= 1.1; // aggressive boost
  }

  return {
    signal,
    confidence: parseFloat(confidence.toFixed(2)),
    sl,
    tp,
    mode
  };
}

// =============================
// SEND SIGNAL TO EA
// =============================
app.get("/signal", (req, res) => {
  const ai = getSignal();

  console.log("🤖 AI:", ai);

  res.json(ai);
});

// =============================
// LEARNING FEEDBACK FROM EA
// =============================
app.post("/result", (req, res) => {
  const profit = req.body.profit || 0;

  if (profit > 0) stats.win++;
  else stats.loss++;

  console.log("📈 RESULT:", profit, " | Stats:", stats);

  res.json({ status: "learned" });
});

// =============================
// SERVER STATUS
// =============================
app.get("/", (req, res) => {
  res.send("AI SCALPER PRO RUNNING 🚀");
});

// =============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AI SERVER RUNNING ON PORT", PORT);
});