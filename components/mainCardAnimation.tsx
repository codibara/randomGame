import React from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CARD_COUNT = 15; // Number of cards per image
const RADIUS_MIN = width * 0.5; // Minimum distance from the center
const RADIUS_MAX = width * 1.3; // Max distance from the center
const CENTER_OFFSET_Y = -height * 0.25;

const cards = [
    require('@/assets/images/cardBack1.png'),
    require('@/assets/images/cardBack2.png'),
    require('@/assets/images/cardBack3.png'),
    require('@/assets/images/cardBack4.png'),
];

export default function MainCardAnimation(){
    const angle = useSharedValue(0);
    const radii = React.useMemo(() => {
        // Generate random radii for each card
        return Array(cards.length * CARD_COUNT)
            .fill(0)
            .map(() => RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN));
    }, []);

    const rotations = React.useMemo(() => {
        return Array(cards.length * CARD_COUNT)
            .fill(0)
            .map(() => Math.random() * 360); // Random rotation in degrees
    }, []);


    React.useEffect(() => {
        angle.value = withRepeat(
            withTiming(2 * Math.PI, {
                duration: 8000, // Adjust speed
                easing: Easing.linear,
            }),
            -1 // Infinite loop
        );
    }, []);

    return (
        <View style={styles.container}>
            {cards.map((cardSource, index) =>
                Array.from({ length: CARD_COUNT }).map((_, cardIndex) => {
                    const totalIndex = index * CARD_COUNT + cardIndex; // Unique index for radii array
                    const offsetAngle =
                        (index * (2 * Math.PI)) / cards.length +
                        (cardIndex * Math.PI) / CARD_COUNT;

                    // Animated style for each card
                    const animatedStyle = useAnimatedStyle(() => {
                        const x = radii[totalIndex] * Math.cos(angle.value + offsetAngle);
                        const y = radii[totalIndex] * Math.sin(angle.value + offsetAngle) + CENTER_OFFSET_Y;
                        return {
                            transform: [
                                { translateX: x },
                                { translateY: y },
                                { rotate: `${rotations[totalIndex]}deg` },
                            ],
                        };
                    });

                    return (
                        <Animated.View
                            key={`card-${index}-${cardIndex}`}
                            style={[styles.cardContainer, animatedStyle]}
                        >
                            <ImageBackground
                                source={cardSource}
                                style={styles.card}
                                imageStyle={styles.cardBackImg}
                            />
                        </Animated.View>
                    );
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        overflow: 'hidden',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
    },
    cardContainer: {
        position: "absolute",
    },
    card: {
        width: 82,
        aspectRatio: 13 / 21,
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 8,
    },
    cardBackImg: {
        borderRadius: 8,
    },
})