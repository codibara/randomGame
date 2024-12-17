import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import CustomButton from "@/components/ui/button";

export default function Settings() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const isButtonDisabled = inputValue.trim() === "";
  const router = useRouter();

  // **Fetch the nickname directly from Supabase**
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        setLoading(true);

        // Get the current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) throw userError || new Error("User not found");

        // Fetch the current username from Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data && data.username) {
          setInputValue(data.username); // Set the input value to fetched username
        }
      } catch (error) {
        console.error("Error fetching nickname from Supabase:", error);
        Alert.alert("Error", "Could not load your nickname.");
      } finally {
        setLoading(false);
      }
    };

    fetchNickname();
  }, []);

  // **Save the nickname to Supabase**
  const handleSave = async () => {
    try {
      setLoading(true);
      const trimmedNickname = inputValue.trim();

      // Check for duplicate nicknames
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", trimmedNickname)
        .single();

      if (existingUser) {
        Alert.alert("Nickname already exists", "Please choose another one.");
        setLoading(false);
        return;
      }

      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw userError || new Error("User not found");

      // Update the username in Supabase
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: trimmedNickname,
        updated_at: new Date(),
      });

      if (error) throw error;

      Alert.alert("Success", "Nickname updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error saving nickname:", error);
      Alert.alert("Error", "Failed to update nickname. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // **Handle logout**
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("@/assets/images/Paper_texture.png")}
    >
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Text style={styles.heading}>Nickname</Text>
          <TextInput
            value={inputValue}
            placeholder="Enter your nickname"
            style={[
              styles.input,
              isFocused ? styles.inputFocused : styles.input,
            ]}
            maxLength={10}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => setInputValue(text)}
          />
          <Text style={styles.characterCounter}>
            {inputValue.length}/10 Characters
          </Text>
          <View>
            <Text style={styles.helperText}>
              • A maximum length of 10 Characters
            </Text>
            <Text style={styles.helperText}>
              • You can change your nickname later in settings.
            </Text>
          </View>
        </View>

        <CustomButton
          text={loading ? "SAVING..." : "SAVE"}
          onPress={handleSave}
          isDisabled={isButtonDisabled || loading}
        />

        <View style={styles.logoutWrapper}>
          <CustomButton
            text={"LOG OUT"}
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  wrapper: {
    width: "80%",
    maxWidth: 400,
    marginHorizontal: 40,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 38,
    marginBottom: 52,
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
  helperText: {
    fontFamily: "GmarketSansMedium",
    color: "#848484",
    paddingVertical: 4,
    fontSize: 12,
    lineHeight: 20,
  },
  characterCounter: {
    color: "#57BEF7",
    textAlign: "right",
    fontSize: 10,
  },
  logoutWrapper: {
    marginTop: 20,
  },
});
