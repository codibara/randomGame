import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { HowToPlay as HowToPlayType } from "../types";


interface HowToPlayProps {
    howToPlay: HowToPlayType;
}

export default function HowToPlayDetail({ howToPlay }: HowToPlayProps) {

    return (
            <View style={styles.container}>
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
    container:{
        padding: 20,
        paddingTop: 60,
    },
    instructionContainer: {
        flex: 1,
        height: 500,
        borderRadius: 24,
        backgroundColor: "#ffffff",
        paddingTop: 32,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginTop: -24,

    },
    section2Heading: {
        fontFamily: "GmarketSansBold",
        width: 260,
        textAlign: "center",
        lineHeight: 24,
        paddingVertical: 16,
        paddingHorizontal: 30,
        backgroundColor: "#262626",
        fontSize: 24,
        color: "#E23F99",
        alignSelf: 'center',
        borderRadius: 50,
        zIndex: 1,
    }
});