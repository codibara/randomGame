import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HowToPlay as HowToPlayType } from "../types";

interface HowToPlayProps {
    howToPlay: HowToPlayType;
}

export default function HowToPlayDetail({ howToPlay }: HowToPlayProps) {

    return (
        <View style={styles.howToPlayWrapper}>
            <Text style={styles.section2Heading}>How To Play</Text>
            <View style={styles.instructionContainer}>
            {Object.entries(howToPlay).map(([key, value], index) => (
                <View key={index}>
                    <Text>{key}</Text>
                    <Text>{value}</Text>
                </View>
            ))}
            </View>
        </View>
      );
};

const styles = StyleSheet.create({
    howToPlayWrapper:{
        paddingTop: 52,
    },
    instructionContainer: {
        flex: 1,
        height: 500,
        borderRadius: 24,
        backgroundColor: "#ffffff",
    },
    section2Heading: {
        textAlign: "center",
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 900,
        color: "#E23F99",
        textShadowColor: "#000000",
        textShadowOffset: { width: -1, height: -1},
        textShadowRadius: 1,
    }
});