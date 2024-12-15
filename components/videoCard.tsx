import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, FlatList } from "react-native";
import YouTubeIframe from 'react-native-youtube-iframe';

interface VideoCardProps {
    link: string[];
  }

  const VideoCard: React.FC<VideoCardProps> = ({ link }) => {
    // const handleOpenLink = (url: string) => {
    //     Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
    //   };

    const extractVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    return (
      <View style={styles.container}>
        <View style={styles.videoCardContainer} >
          {link.map((link, index) => {
            const videoId = extractVideoId(link);
            return (
              <View key={index}>
                {videoId ? (
                  <YouTubeIframe
                    videoId={videoId}
                    height={200}
                  />
                ) : (
                  <View style={styles.invalidUrlContainer}>
                    <Text style={styles.invalidUrlText}>Invalid YouTube URL</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  
  export default VideoCard;
  
  const styles = StyleSheet.create({
    container:{
      padding: 20,
    },
    videoCardContainer: {
        display: "flex",
        flexDirection: "column",
        rowGap: 16,
        padding: 20,
        marginVertical: 30,
        backgroundColor: "rgba(28, 3, 17, 0.7)",
        borderRadius: 24,
    },
    videoContainer: {
      marginBottom: 20,
    },
    invalidUrlContainer: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    invalidUrlText: {
      color: '#ff0000',
    },
  });