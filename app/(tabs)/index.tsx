import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";

const SERVER = "https://ai-trader-gk3f.onrender.com";

export default function HomeScreen() {
  const [data, setData] = useState({
    balance: 0,
    equity: 0,
    profit: 0,
  });

  const [history, setHistory] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${SERVER}/data`);
      setData(res.data);
      setHistory((prev) => [...prev.slice(-10), res.data.equity]);
    } catch (err: any) {
      console.log("ERROR:", err.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f172a", padding: 15 }}>
      <Text style={{ color: "#fff", fontSize: 22 }}>🤖 AI Trader</Text>

      <View
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
          marginVertical: 20,
        }}
      >
        <Text style={{ color: "#94a3b8" }}>Balance</Text>
        <Text style={{ color: "#fff", fontSize: 20 }}>
          ${data.balance}
        </Text>

        <Text style={{ color: "#94a3b8" }}>Equity</Text>
        <Text style={{ color: "#fff", fontSize: 18 }}>
          ${data.equity}
        </Text>

        <Text style={{ color: data.profit >= 0 ? "green" : "red" }}>
          Profit: ${data.profit}
        </Text>
      </View>

      <LineChart
        data={{
          labels: [],
          datasets: [{ data: history.length ? history : [0] }],
        }}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#0f172a",
          backgroundGradientTo: "#0f172a",
          color: () => "#22c55e",
        }}
      />
    </ScrollView>
  );
}