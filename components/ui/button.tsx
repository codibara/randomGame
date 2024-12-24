import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import GlobalStyles from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  isDisabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  isDisabled = false,
  iconName,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        GlobalStyles.primaryBtnActive,
        isDisabled
          ? GlobalStyles.primaryBtnDisabled
          : isPressed
          ? GlobalStyles.primaryBtnPressed
          : GlobalStyles.primaryBtnEnabled,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={1} // fully opaque
    >
      <View style={GlobalStyles.primaryBtnWrapper}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={isDisabled ? "#848484" : isPressed ? "#ffffff" : "#FF00A1"}
          />
        )}
        <Text
          style={[
            GlobalStyles.primaryBtnText,
            isDisabled
              ? GlobalStyles.primaryBtnTextDisabled
              : isPressed
              ? GlobalStyles.primaryBtnTextPressed
              : GlobalStyles.primaryBtnTextEnabled,
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
