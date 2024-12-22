import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

interface AttributeCardProps {
  heading: string;
  value: number | string;
  isEmoji?: boolean;
  emoji?: string;
}

const AttributeCard: React.FC<AttributeCardProps> = ({ heading, value, emoji, isEmoji = true }) => {
  return (
    <ImageBackground
      source={require("@/assets/images/attributeBgImg.png")}
      style={styles.attributeContainer}
      imageStyle={{ borderRadius: 12, resizeMode: 'cover', width: 'auto', height: 'auto' }}
    >
      <Text style={styles.attributeHeading}>{heading}</Text>
      <View style={styles.valueContainer}>
        {isEmoji && typeof value === 'number' ? (
          Array.from({ length: value }).map((_, index) => (
            <Text key={index} style={styles.attributeValue}>{emoji}</Text>
          ))
        ) : (
          <Text style={styles.textValue}>{value}</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  attributeContainer: {
    width: "48%",
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginBottom: 12,
  },
  attributeHeading: {
    fontFamily: "GmarketSansMedium",
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  attributeValue: {
    fontSize: 32,
    marginHorizontal: 2,
  },
  textValue: {
    fontFamily: "GmarketSansMedium",
    fontSize: 12,
    lineHeight: 16,
    color: "#333",
  },
});

export default AttributeCard;
