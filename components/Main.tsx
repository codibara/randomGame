import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import MainCardAnimation from "./mainCardAnimation";
import CustomButton from "./ui/button";
import gameData from "@/assets/data/gameData.json";
import { Game } from "@/types";

import GlobalStyles from "@/styles/globalStyles";

const { width, height } = Dimensions.get("window");

export default function Main({ username }: { username: string }) {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedGame(null);
      setModalVisible(false);
    }, [])
  );

  const handleSelectRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gameData.games.length);
    setSelectedGame(gameData.games[randomIndex]);
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.cardAnimationContainer}>
        <MainCardAnimation />
      </View>
      <ImageBackground
        style={styles.mainContainer}
        source={require("@/assets/images/Paper_texture.png")}
      >
        <View style={styles.mainTitleWrapper}>
          <Text style={GlobalStyles.appText1}>{username}'s FAV</Text>
          <Text style={GlobalStyles.appText2}>Random</Text>
          <Text style={GlobalStyles.appText2}>Game</Text>
        </View>

        <View style={styles.playButton}>
          <CustomButton text="GAME START" onPress={handleSelectRandomGame} />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={require("@/assets/images/cardFront.png")}
              style={styles.modalContent}
              imageStyle={{ borderRadius: 28 }}
            >
              <View style={styles.closeButtonWrapper}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-outline" size={32} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                {selectedGame && (
                  <>
                    <Text style={styles.modalTitle}>
                      {selectedGame.EngName}
                    </Text>
                    <View style={styles.attributesContainer}>
                      <Text style={styles.attributesText}>
                        😵‍💫 x {selectedGame.Attributes.Difficulty}
                      </Text>
                      <Text style={styles.attributesText}>
                        🔊 x {selectedGame.Attributes.NoiseLevel}
                      </Text>
                      <Text style={styles.attributesText}>
                        🍺 x {selectedGame.Attributes.RiskLevel}
                      </Text>
                    </View>
                    <View style={{ width: "100%" }}>
                      <CustomButton
                        text="MORE DETAILS"
                        onPress={() => router.push(`/game/${selectedGame.id}`)}
                      />
                    </View>
                  </>
                )}
              </View>
            </ImageBackground>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  cardAnimationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  mainTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: width * 0.9,
    marginTop: height * 0.15,
    maxWidth: 450,
    zIndex: 1,
  },
  playButton: {
    position: "absolute",
    bottom: 56,
    width: width * 0.9,
    maxWidth: 400,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    display: "flex",
    justifyContent: "flex-end",
    width: width * 0.9,
    maxWidth: 400,
    aspectRatio: 13 / 21,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: "GmarketSansBold",
    textAlign: "center",
    fontSize: 24,
  },
  closeButtonWrapper: {
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 20,
  },
  cardContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  attributesContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  attributesText: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 40,
    paddingVertical: 12,
  },
});
