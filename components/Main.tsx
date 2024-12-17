import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MainCardAnimation from "./mainCardAnimation";
import CustomButton from "./ui/button";
import gameData from "@/assets/data/gameData.json";
import { Game } from "@/types";

const { width, height } = Dimensions.get("window");

export default function Main({ username }: { username: string }) {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState("Your");

  //get the nickname from the storage and set the nickname
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const savedNickname = await AsyncStorage.getItem("nickname");
        if (savedNickname) {
          setNickname(savedNickname);
        }
      } catch (error) {
        console.error("Error fetching nickname:", error);
      }
    };

    fetchNickname();
  }, []);

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
          <Text style={styles.appText1}>{username}'s FAV</Text>
          <Text style={styles.appText2}>Random Game</Text>
        </View>
        <View style={styles.playButton}>
          <CustomButton text={"GAME START"} onPress={handleSelectRandomGame} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={require("@/assets/images/card_front.png")}
              style={styles.modalContent}
              imageStyle={{ borderRadius: 28 }}
            >
              <View style={styles.closeButtonWrapper}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                {selectedGame && (
                  <>
                    <Text style={styles.modalTitle}>
                      {selectedGame.EngName}
                    </Text>
                    <ImageBackground
                      source={require("@/assets/images/excardgameimg.png")}
                      style={styles.cardGameImg}
                    />
                    <CustomButton
                      text={"MORE DETAILS"}
                      onPress={() => router.push(`/game/${selectedGame.id}`)}
                    />
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
    position: "absolute",
    width: width * 0.9,
    marginTop: height * 0.2,
    maxWidth: 450,
    zIndex: 1,
  },
  appText1: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 32,
    textTransform: "uppercase",
  },
  appText2: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 40,
    marginBottom: 30,
    textTransform: "uppercase",
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
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    display: "flex",
    justifyContent: "flex-end",
    width: width * 0.7,
    aspectRatio: 13 / 21,
    marginTop: height * 0.25,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 28,
    //for IOS start
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    //for IOS end
    elevation: 8, // Elevation for Android
  },
  modalTitle: {
    fontFamily: "GmarketSansBold",
    textAlign: "center",
    fontSize: 24,
  },
  closeButtonWrapper: {
    display: "flex",
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 10,
  },
  cardContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardGameImg: {
    width: 200,
    aspectRatio: 1 / 1,
  },
});
