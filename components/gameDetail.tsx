import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function GameDetail() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>게임 상세 페이지</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
