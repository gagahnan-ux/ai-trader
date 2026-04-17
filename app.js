import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function App() {

  // 🔥 TUKAR IKUT IP PC KAU
  const SERVER = "http://192.168.0.23:3000";

  const [status, setStatus] = useState("LOADING...");
  const [balance, setBalance] = useState(0);
  const [equity, setEquity] = useState(0);
  const [profit, setProfit] = useState(0);
  const [history, setHistory] = useState([]);
  const [trades, setTrades] = useState([]);

  const screenWidth = Dimensions.get("window").width;

  // ===== STATUS =====
  const getStatus = async () => {
    try {
      const res = await fetch(SERVER + "/status");
      const data = await res.json();
      setStatus(data.running ? "RUNNING" : "STOPPED");
    } catch {
      setStatus("OFFLINE");
    }
  };

  // ===== DATA =====
  const getData = async () => {
    try {
      const res = await fetch(SERVER + "/data");
      const data = await res.json();

      setBalance(data.balance || 0);
      setEquity(data.equity || 0);
      setProfit(data.profit || 0);
      setTrades(data.trades || []);

      // graph
      setHistory(prev => {
        let arr = [...prev, data.profit || 0];
        if (arr.length > 20) arr.shift();
        return arr;
      });

    } catch (err) {
      console.log(err);
    }
  };

  // ===== AUTO REFRESH =====
  useEffect(() => {

    getStatus();
    getData();

    const interval = setInterval(() => {
      getStatus();
      getData();
    }, 2000);

    return () => clearInterval(interval);

  }, []);

  // ===== UI =====
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>NAL AI TRADER</Text>

      <Text style={[
        styles.status,
        status === "RUNNING" ? styles.green : styles.red
      ]}>
        {status}
      </Text>

      {/* ACCOUNT */}
      <View style={styles.card}>
        <Text style={styles.text}>Balance: {balance}</Text>
        <Text style={styles.text}>Equity: {equity}</Text>
        <Text style={[
          styles.text,
          profit >= 0 ? styles.green : styles.red
        ]}>
          Profit: {profit}
        </Text>
      </View>

      {/* GRAPH */}
      <Text style={styles.section}>Profit Graph</Text>

      <LineChart
        data={{
          labels: [],
          datasets: [{ data: history.length ? history : [0] }]
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#000",
          backgroundGradientFrom: "#000",
          backgroundGradientTo: "#000",
          color: () => "#00ff99",
          decimalPlaces: 2
        }}
      />

      {/* TRADES */}
      <Text style={styles.section}>Open Trades</Text>

      <View style={styles.card}>
        {trades.length === 0 && (
          <Text style={styles.text}>No open trades</Text>
        )}

        {trades.map((t, i) => (
          <View key={i} style={styles.tradeBox}>
            <Text style={styles.text}>{t.symbol}</Text>
            <Text style={[
              styles.text,
              t.profit >= 0 ? styles.green : styles.red
            ]}>
              {t.profit}
            </Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

// ===== STYLE =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10
  },
  title: {
    color: "#00ff99",
    fontSize: 26,
    textAlign: "center",
    marginTop: 30
  },
  status: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20
  },
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  text: {
    color: "#fff",
    fontSize: 16
  },
  green: {
    color: "#00ff99"
  },
  red: {
    color: "#ff4d4d"
  },
  section: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10
  },
  tradeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  }
});