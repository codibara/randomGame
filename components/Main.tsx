import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Main() {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.list}>메인 페이지</Text>
      </View>
      <Link href="/game/1">A.P.T Game</Link>
      <Link href="/game/2">3! 6! 9!</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
  },
  list: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
