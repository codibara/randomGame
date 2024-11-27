import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import gameData from "@/assets/data/gameData.json";
import GameDetail from "@/components/gameDetail";
import HowToPlayDetail from "@/components/howToPlay";
import VideoCard from "@/components/videoCard";

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
    <>
      <ScrollView style={styles.container}>
        <View>
          <GameDetail game={game}/>
        </View>
        <View>
          <HowToPlayDetail howToPlay={game.HowToPlay}/>
          <VideoCard link={game.SeeItInAction}/>
        </View>
        
      </ScrollView>
      {/* <View style={styles.container}>
        <Link href="/game/1">A.P.T Game</Link>
        <Link href="/game/2">3! 6! 9!</Link>
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  list: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
