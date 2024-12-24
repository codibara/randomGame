import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Game } from "../types";

import AttributeCard from "./attributeCard";

interface GameDetailProps {
  game: Game;
}

export default function GameDetail({ game }: GameDetailProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.titleContainer}
        source={require("@/assets/images/paper-texture4.png")}
      >
        <Text style={styles.korTitle}>{game.KorName}</Text>
        <Text style={styles.engTitle}>{game.EngName}</Text>
      </ImageBackground>
      <View style={styles.attributeWrapper}>
        <AttributeCard
          heading="Difficulty"
          value={game.Attributes.Difficulty}
          emoji={"😵‍💫"}
          isEmoji={true}
        />
        <AttributeCard
          heading="Noise Level"
          value={game.Attributes.NoiseLevel}
          emoji={"🔊"}
          isEmoji={true}
        />
        <AttributeCard
          heading="Risk Level"
          value={game.Attributes.RiskLevel}
          emoji={"🍺"}
          isEmoji={true}
        />
        <AttributeCard
          heading="Required"
          value={game.Attributes.Required}
          isEmoji={false}
        />
      </View>
      <ImageBackground
        source={require("@/assets/images/torn-line.png")}
        style={styles.divider}
      ></ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  titleContainer: {
    height: 210,
    flex: 1,
    display: "flex",
    gap: 8,
    marginBottom: 32,
    paddingTop: 26,
    padding: 20,
  },
  korTitle: {
    marginTop: 12,
    fontFamily: "GmarketSansLight",
  },
  pronounceText: {
    fontFamily: "GmarketSansLight",
    color: "#A1A0A0",
    fontSize: 12,
  },
  engTitle: {
    fontFamily: "HakgyoansimBold600",
    flex: 1,
    flexWrap: "wrap",
    fontSize: 40,
    textTransform: "uppercase",
  },
  attributeWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  divider: {
    position: "absolute",
    bottom: -60,
    flex: 1,
    width: 400,
    height: 100,
    zIndex: 5,
  },
});
