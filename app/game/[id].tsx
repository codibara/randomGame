import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function GameScreen() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <View style={styles.container}>
        <Text>Game {id} </Text>
      </View>
      <View style={styles.container}>
        <Link href="/game/1">A.P.T Game</Link>
        <Link href="/game/2">3! 6! 9!</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
