import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";

interface VideoCardProps {
    link: string[];
  }

  const VideoCard: React.FC<VideoCardProps> = ({ link }) => {
    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
      };

    return (
      <View style={styles.container}>
        {link.map((link, index) => (
            <TouchableOpacity 
                key={index} 
                onPress={() => handleOpenLink(link)}
                style={styles.videoCard}
            >
                <View style={styles.thumbnail}></View>
                <Text style={styles.linkText}>
                    {link}
                </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  export default VideoCard;
  
  const styles = StyleSheet.create({
    container: {
        paddingVertical: 36,
        display: "flex",
        flexDirection: "column",
        rowGap: 16,
    },
    thumbnail:{
        width: "36%",
        aspectRatio: 16/9,
        backgroundColor: "#6a6a6a",
        borderRadius: 8,
    },
    videoCard: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        columnGap: 20,
        padding: 12,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 4,
    },
    linkText: {
        flex: 1, 
        flexWrap: "wrap",
        fontSize: 16,
        color: "#ffffff",
        textDecorationLine: "underline",
    }
  });