import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HowToPlay as HowToPlayType } from "../types";


interface HowToPlayProps {
    howToPlay: HowToPlayType;
}

export default function HowToPlayDetail({ howToPlay }: HowToPlayProps) {

    const howToPlayEntries = Object.entries(howToPlay);

    return (
            <View style={styles.container}>
                <Text style={styles.section2Heading}>How To Play</Text>
                <View style={styles.instructionContainer}>
                {howToPlayEntries.map(([key, value], index) => (
                    <View key={index} style={[styles.stepContainer,
                        index === howToPlayEntries.length - 1 && styles.stepLastContainer,
                     ]}>
                        <Text style={styles.stepNumber}>{key}</Text>
                        <Text style={styles.stepDetail}>{value}</Text>
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
        borderRadius: 24,
        backgroundColor: "#ffffff",
        paddingTop: 32,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginTop: -24,
        marginBottom: 60,
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
    },
    stepContainer:{
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: "#848484",
    },
    stepLastContainer:{
        borderBottomWidth: 0,
    },
    stepNumber:{
        width: 52,
        height: 52,
        fontFamily: "GmarketSansBold",
        fontSize: 24,
        backgroundColor: '#57BEF7',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 999,
    },
    stepDetail: {
        flex: 1,
        fontFamily: "GmarketSansMedium",
        lineHeight: 20,
    },
});