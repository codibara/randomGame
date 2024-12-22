import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
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
        console.log("Existing user:", existingUser);
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
      console.log("Success");
      router.push("/");
    } catch (error) {
      console.error("Error saving nickname:", error);
    } finally {
      setLoading(false);
    }
  };

  // **Handle logout**
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
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Text style={styles.heading}>Nickname</Text>
          <View>
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
          </View>
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
    maxWidth: 450,
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
    marginBottom: 8,
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
    fontFamily: "GmarketSansMedium",
    color: "#57BEF7",
    textAlign: "right",
    fontSize: 10,
  },
  logoutWrapper: {
    marginTop: 20,
  },
});
