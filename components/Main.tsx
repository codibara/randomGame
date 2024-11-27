import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import gameData from "@/assets/data/gameData.json";
import { Game } from "@/types";


interface CardParams {
  radius: number;
  angleOffset: number;
  backgroundColor: string;
  tiltAngle: number;
}

const { width, height } = Dimensions.get('window');
const CENTER_X = width / 2;
const CENTER_Y = height / 2;
const NUM_CARDS = 20;
const CARD_WIDTH = 100; 
const CARD_HEIGHT = 180;
const MIN_RADIUS = 230;

export default function Main() {
  const router = useRouter();
  const baseRotation = useSharedValue(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null); 
  const [modalVisible, setModalVisible] = useState(false);
  
  React.useEffect(() => {
    baseRotation.value = withRepeat(withTiming(360, { duration: 8000 }), -1, false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedGame(null);
      setModalVisible(false);
    }, [])
  );

  // Helper function to generate random parameters for each card
  const generateRandomParams = (): CardParams => {
    const radius = Math.random() * 150 + MIN_RADIUS;
    const angleOffset = Math.random() * 360;
    const colors = ['#e13e98', '#272325', '#dfdbdd'];
    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    const tiltAngle = (Math.random() - 0.5) * 20;

    return { radius, angleOffset, backgroundColor, tiltAngle };
  };

  // Create an array of random parameters for each card
  const randomParamsArray = Array.from({ length: NUM_CARDS }, generateRandomParams);

  // Render each card with its unique path
  const renderCards = () => {
    return randomParamsArray.map((params, index) => {
      const { radius, angleOffset, backgroundColor, tiltAngle } = params;

      // Shared value for each card's rotation
      const cardRotation = useSharedValue(angleOffset);

      // Start the rotation animation for each card
      React.useEffect(() => {
        cardRotation.value = withRepeat(withTiming((360) + angleOffset, { duration: 8000 }), -1);
      }, []);

      // Animated style for each card
      const animatedStyle = useAnimatedStyle(() => {
        const rotate = (cardRotation.value * Math.PI) / 180;
        const x = CENTER_X + radius * Math.cos(rotate) - CARD_WIDTH / 2;
        const y = CENTER_Y + radius * Math.sin(rotate) - CARD_HEIGHT / 2;

        return {
          position: 'absolute',
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 4,
          backgroundColor,
          borderWidth: 0.5,
          borderColor: '#ffffff',
          transform: [{ translateX: x }, { translateY: y }, { rotate: `${tiltAngle}deg` }],
        };
      });

      return <Animated.View key={index} style={animatedStyle} />;
      
    });
  };
  
  const handleSelectRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gameData.games.length);
    setSelectedGame(gameData.games[randomIndex]);
    setModalVisible(true);
  };

  return (
      <View >
          {/* {renderCards()} */}
          <View style={styles.mainTitleWrapper}>
            <Text style={styles.appText}>Your Favorite Random Game</Text>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={handleSelectRandomGame}
            >
              <Text style={styles.buttonText}>Pick a Random Game</Text>
              <Ionicons 
                name="chevron-forward-outline" 
                size={24} 
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedGame && (
                <>
                  <Text style={styles.modalTitle}>{selectedGame.EngName}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedGame.KorName} [{selectedGame.Pronounce}]
                  </Text>
                  <Text style={styles.modalAttributes}>
                    Difficulty: {selectedGame.Attributes.Difficulty}
                  </Text>
                  <Text style={styles.modalAttributes}>
                    Required: {selectedGame.Attributes.Required}
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => router.push(`/game/${selectedGame.id}`)}
                  >
                    <Text style={styles.closeButtonText}>See Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mainTitleWrapper:{
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    height: '100%',
    zIndex: -1,
  },
  appText:{
    fontWeight: 800,
    fontSize: 40,
    textAlign: "center",
    marginBottom: 30,
  },
  playButton:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    backgroundColor: "#ffffff",
  },
  buttonText: {
    fontWeight: 800,
    fontSize: 24,
    transform: [{translateY: -2}]
  },
  modalOverlay: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: 500,
    width: 350,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalAttributes: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#e23f99",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
