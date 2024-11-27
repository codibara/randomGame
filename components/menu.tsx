import React from "react";
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { Link } from "expo-router";
import gameData from "@/assets/data/gameData.json";
import { Ionicons } from "@expo/vector-icons";

type MenuProps = {
    handler: () => void; // Function to toggle the menu
  };

export default function Menu({ handler }: MenuProps){
    const games = gameData.games;
    return(
        <View style={styles.menuContainer}>
            <ScrollView>
                <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>Jenna’s Favorite Game</Text>
                    <TouchableOpacity onPress={handler} style={styles.closeButton}>
                        <Ionicons
                            name="close-outline" 
                            size={24} 
                            color="#E9E9E9"
                            onPress={handler}
                        />
                    </TouchableOpacity>
                </View>
                {games.map((game, index) => {
                    return (
                        <View key={index} style={styles.menuItem}>
                            <Link 
                                href={`/game/${game.id}`} 
                                onPress={handler}
                            >
                                <Text style={styles.gameLink}>{game.EngName}</Text>
                            </Link>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
    },
    menuHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuTitle:{
        flex: 1,
        color: '#E9E9E9',
    },
    closeButton: {
      marginBottom: 16,
    },
    menuItem:{
        paddingVertical: 12,
    },
    gameLink: {
      fontSize: 18,
      marginVertical: 8,
      color: '#E9E9E9',
    },
  });