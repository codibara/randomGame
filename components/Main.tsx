import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from "./ui/button";
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
  const [nickname, setNickname] = useState('Your');

  //get nickname from the storage and set nickname
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const savedNickname = await AsyncStorage.getItem('nickname'); // 
        if (savedNickname) {
          setNickname(savedNickname);
        }
      } catch (error) {
        console.error('Error fetching nickname:', error);
      }
    };

    fetchNickname();
  }, []); 
  
  useEffect(() => {
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
      <ImageBackground 
        style={styles.mainContainer}
        source={require("@/assets/images/Paper_texture.png")}
      >
          {/* {renderCards()} */}
          <View style={styles.mainTitleWrapper}>
            <Text style={styles.appText1}>{nickname}'s FAV</Text>
            <Text style={styles.appText2}>Random Game</Text>
          </View>
          <View style={styles.playButton}>
              <CustomButton 
                  text={'GAME START'}
                  onPress={handleSelectRandomGame}
              />
          </View>
          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground 
              source={require("@/assets/images/excardbackimg.png")}
              style={styles.modalContent}
              imageStyle={{ borderRadius: 16,}}
            >
              <View style={styles.closeButtonWrapper}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons
                      name="close-outline" 
                      size={24} 
                      color="#000"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.cardContent}>
                {selectedGame && (
                  <>
                    <Text style={styles.modalTitle}>{selectedGame.EngName}</Text>
                    <ImageBackground 
                      source={require("@/assets/images/excardgameimg.png")}
                      style={styles.cardGameImg}
                    />
                    <CustomButton 
                      text={'MORE DETAILS'}
                      onPress={() => router.push(`/game/${selectedGame.id}`)}
                    />
                  </>
                )}
              </View>
            </ImageBackground>
          </View>
        </Modal>
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  mainTitleWrapper: {
    width: width * 0.9,
    marginTop: height * 0.20,
    maxWidth: 450,
  },
  appText1: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 32,
    textTransform: 'uppercase',
  },
  appText2: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 40,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  playButton: {
    position: 'absolute',
    bottom: 56,
    width: width * 0.9,
    maxWidth: 400,
  },
  modalOverlay: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: height * 0.3,
    width: width * 0.7,
    aspectRatio: 13/21,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontFamily: "GmarketSansBold",
    textAlign: 'center',
    fontSize: 24,
  },
  closeButtonWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 10,
  },
  cardContent:{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardGameImg:{
    width: 200,
    aspectRatio: 1/1,
  }
});
