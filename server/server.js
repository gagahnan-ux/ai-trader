// ===============================
// AI BRAIN PRO SERVER (FINAL)
// ===============================
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let marketData = {};

// ===============================
// RECEIVE DATA FROM EA
// ===============================
app.post("/data", (req, res) => {
  marketData = req.body;

  console.log("DATA:", marketData);

  res.json({ status: "ok" });
});

// ===============================
// AI BRAIN FUNCTION
// ===============================
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
  let price = marketData.price || 0;

  // ===============================
  // TREND DETECTION (simple)
  // ===============================
  let trend = "RANGE";

  if (rsi > 55) trend = "UP";
  if (rsi < 45) trend = "DOWN";

  // ===============================
  // SIGNAL LOGIC
  // ===============================
  let signal = "HOLD";
  let confidence = 0.5;

  // BUY CONDITION
  if (rsi < 30 && trend !== "DOWN") {
    signal = "BUY";
    confidence = 0.75;
  }

  // SELL CONDITION
  if (rsi > 70 && trend !== "UP") {
    signal = "SELL";
    confidence = 0.75;
  }

  // TREND FOLLOW
  if (trend === "UP" && rsi > 50 && rsi < 65) {
    signal = "BUY";
    confidence = 0.65;
  }

  if (trend === "DOWN" && rsi < 50 && rsi > 35) {
    signal = "SELL";
    confidence = 0.65;
  }

  // ===============================
  // SPREAD FILTER
  // ===============================
  if (spread > 30) {
    signal = "HOLD";
    confidence = 0;
  }

  // ===============================
  // VOLATILITY (fake simple)
  // ===============================
  let sl = 120;
  let tp = 90;

  if (spread < 15) {
    sl = 100;
    tp = 80;
  }

  // ===============================
  // MODE SYSTEM
  // ===============================
  let mode = "SAFE";

  if (confidence > 0.7) mode = "SCALP";
  if (confidence > 0.8) mode = "KILL";

  return {
    signal,
    confidence,
    sl,
    tp,
    mode,
    trend
  };
}

// ===============================
// SEND SIGNAL TO EA
// ===============================
app.get("/signal", (req, res) => {
  const ai = getSignal();

  console.log("AI:", ai);

  res.json(ai);
});

// ===============================
// LEARNING HOOK (future AI)
// ===============================
app.post("/result", (req, res) => {
  console.log("RESULT:", req.body);
  res.json({ status: "learned" });
});

// ===============================
app.get("/", (req, res) => {
  res.send("AI BRAIN RUNNING 🚀");
});

// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AI SERVER RUNNING ON PORT", PORT);
});