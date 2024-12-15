import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, ImageBackground } from "react-native";
import gameData from "@/assets/data/gameData.json";
import GameDetail from "@/components/gameDetail";
import HowToPlayDetail from "@/components/howToPlay";

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const game = gameData.games.find((game) => game.id.toString() === id); 

  if (!game) {
    return (
      <View>
        <Text>Game not found</Text>
      </View>
    );
  }

  return (
      <ScrollView style={styles.container}>
        <ImageBackground
          source={require("@/assets/images/Paper_texture.png")}
        >
          <GameDetail game={game}/>
        </ImageBackground>
        <ImageBackground
          source={require("@/assets/images/logo-pattern.png")}
        >
          <HowToPlayDetail howToPlay={game.HowToPlay}/>
        </ImageBackground>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },

});
