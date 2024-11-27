import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Game  } from "../types";

interface GameDetailProps {
  game: Game;
}

export default function GameDetail({ game }: GameDetailProps) {
  return (
    <View>
      <View style={styles.korTitleContainer}>
        <Text>{game.KorName}</Text>
        <Text style={styles.pronounceText}>{'[' + game.Pronounce + ']'}</Text>
      </View>
      <Text style={styles.engTitle} >{game.EngName}</Text>
      <View style={styles.attributeWrapper}>
        {Object.entries(game.Attributes).map(([key, value]) => (
          <View key={key} style={styles.attributeContainer}>
            <Text style={styles.attributeHeading}>{key}</Text>
            <Text>{value}</Text>
          </View>
        ))}      
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  korTitleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
  pronounceText:{
    color: "#A1A0A0"
  },
  engTitle: {
    flex: 1, 
    flexWrap: "wrap",
    fontSize: 50,
    textTransform: "uppercase",
    fontWeight: 900,
    lineHeight: 70,
    marginBottom: 100,
  },
  attributeHeading: {
    fontWeight: "bold",
  },
  attributeWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  attributeContainer: {
    width: "48%",
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 12,
  },
});
