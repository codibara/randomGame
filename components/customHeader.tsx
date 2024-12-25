// components/CustomHeader.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CustomHeaderProps = {
    title?: string;
    onMenuPress?: () => void;
    onBackPress?: () => void;
    onSharePress?: () => void;
  };

  const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onMenuPress, onBackPress, onSharePress}) => {
    return (
      <View style={styles.headerContainer}>
        {onMenuPress && (
          <TouchableOpacity 
            onPress={onMenuPress} 
            style={styles.iconButton}
        >
            <Ionicons 
                name="menu-outline" 
                size={24} 
                color="#010101" 
            />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        {onSharePress && (
          <TouchableOpacity 
            onPress={onSharePress} 
            style={styles.iconButton}
          >
            <Ionicons 
                name="share-social-outline" 
                size={24} 
                color="#010101" 
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
