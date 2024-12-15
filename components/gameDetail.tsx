import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Game  } from "../types";

interface GameDetailProps {
  game: Game;
}

export default function GameDetail({ game }: GameDetailProps) {
  return (
    <View style={styles.container}>
      <ImageBackground 
        style={styles.titleContainer}
        source={require("@/assets/images/torn-paper.png")}
      >
        <Text style={styles.korTitle}>{game.KorName}</Text>
        <Text style={styles.pronounceText}>{'[' + game.Pronounce + ']'}</Text>
        <Text style={styles.engTitle} >{game.EngName}</Text>
      </ImageBackground>
      
      <View style={styles.attributeWrapper}>
        {Object.entries(game.Attributes).map(([key, value]) => (
          <ImageBackground 
            key={key} 
            source={require("@/assets/images/attributeBgImg.png")}
            style={styles.attributeContainer}
            imageStyle={{ borderRadius: 12, resizeMode: 'cover', width: 'auto', height: 'auto'}}
          >
            <Text style={styles.attributeHeading}>{key}</Text>
            <Text>{value}</Text>
          </ImageBackground>
        ))}      
        </View>
        <ImageBackground 
          source={require("@/assets/images/torn-line.png")}
          style={styles.divider}
        ></ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    paddingBottom: 20,
  },
  titleContainer: {
    height: 300,
    flex: 1,
    display: "flex",
    gap: 8,
    marginBottom: 16,
    paddingTop: 26,
    padding: 20,
  },
  korTitle:{
    fontFamily: "GmarketSansLight",
  },
  pronounceText:{
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
  attributeHeading: {
    fontFamily: "GmarketSansMedium",
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
  attributeContainer: {
    width: "48%",
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 12,
    borderWidth:1,
    borderColor: '#D9D9D9',
  },
  divider: {
    position: 'absolute',
    bottom: -60,
    flex: 1,
    width: 400,
    height: 100,
    zIndex: 5,
  }
});
