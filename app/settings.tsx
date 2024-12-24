import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Text,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import CustomButton from "@/components/ui/button";

const { width, height } = Dimensions.get("window");

export default function Settings() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const isButtonDisabled = inputValue.trim() === "";
  const router = useRouter();

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) throw userError || new Error("User not found");

        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data && data.username) {
          setInputValue(data.username);
        }
      } catch (error) {
        console.error("Error fetching nickname:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNickname();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const trimmedNickname = inputValue.trim();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw userError || new Error("User not found");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: trimmedNickname,
        updated_at: new Date(),
      });

      if (error) throw error;
      console.log("Success");
      router.push("/");
    } catch (error) {
      console.error("Error saving nickname:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("@/assets/images/Paper_texture.png")}
    >
      <View style={styles.mainWrapper}>
        <View style={styles.mainTitleWrapper}>
          <Text style={styles.heading}>Nickname</Text>
        </View>
        <View style={styles.formWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                isFocused ? styles.inputFocused : styles.input,
              ]}
              maxLength={10}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={(text) => setInputValue(text)}
              value={inputValue}
              placeholder="Enter your nickname"
              autoCapitalize="none"
            />
            <Text style={styles.counterText}>
              {inputValue.length}/10 Characters
            </Text>
          </View>
          <View style={styles.helperTextWrapper}>
            <Text style={styles.helperText}>
              • A maximum length of 10 Characters
            </Text>
            <Text style={styles.helperText}>
              • You can change your nickname later in settings.
            </Text>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <CustomButton
            text={loading ? "SAVING..." : "SAVE"}
            onPress={handleSave}
            isDisabled={isButtonDisabled || loading}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            text="SIGN OUT"
            onPress={handleLogout}
            isDisabled={loading}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  mainWrapper: {
    width: width * 0.8,
    maxWidth: 450,
  },
  mainTitleWrapper: {
    marginBottom: 36,
    alignItems: "center",
  },
  formWrapper: {
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "GmarketSansMedium",
    fontSize: 12,
    color: "#FF00A1",
    marginBottom: 6,
  },
  heading: {
    fontFamily: "GmarketSansBold",
    textAlign: "center",
    fontSize: 24,
  },
  input: {
    fontFamily: "GmarketSansMedium",
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#848484",
    paddingVertical: 10,
    textDecorationLine: "none",
  },
  inputFocused: {
    backgroundColor: "#D9D9D9",
  },
  counterText: {
    fontFamily: "GmarketSansMedium",
    color: "#57BEF7",
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
  helperTextWrapper: {
    marginTop: 10,
  },
  helperText: {
    fontFamily: "GmarketSansMedium",
    color: "#848484",
    fontSize: 12,
    lineHeight: 20,
  },
  buttonWrapper: {
    marginBottom: 20,
  },
});
