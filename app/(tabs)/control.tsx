import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";

const SERVER = "https://ai-trader-gk3f.onrender.com";

export default function ControlScreen() {
  const send = async (cmd: string) => {
    try {
      await axios.post(`${SERVER}/command`, { command: cmd });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Control</Text>

      <TouchableOpacity onPress={() => send("BUY")}>
        <Text>BUY</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => send("SELL")}>
        <Text>SELL</Text>
      </TouchableOpacity>
    </View>
  );
}