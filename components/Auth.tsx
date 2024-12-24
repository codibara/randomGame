import React, { useState } from "react";
import {
  StyleSheet,
  View,
  AppState,
  Dimensions,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router"; 

import CustomButton from "./ui/button";
import GlobalStyles from "@/styles/globalStyles";

const { width, height } = Dimensions.get("window");

// Automatically refresh Supabase session in the foreground
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

interface AuthProps {
  onUsernameFetch: (username: string) => void; // Callback to update the username in the parent component
}

export default function Auth({ onUsernameFetch }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const isButtonDisabled = email.trim() === "" || password.trim() === "";
  const router = useRouter(); // Initialize useRouter

  // Sign up with email
  async function signUpWithEmail() {
    if (!validateInputs()) return;

    setLoading(true);


    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        const userId = data.user?.id;

        if (!userId) throw new Error("User not found");

        // Use the user's email as the default username
        const userEmail = data.user.email || email;

        // Upsert user email and username (default to email) into profiles table
        const { error: insertError } = await supabase.from("profiles").upsert([
          {
            id: userId,
            email: userEmail,
            username: userEmail, // Default username as email
            updated_at: new Date(),
          },
        ]);

        if (insertError) throw insertError;

        onUsernameFetch(userEmail); // Update the username in the parent
        //console.log("Username:", userEmail);

        // Navigate to the Settings screen
        router.push("/settings");
      } else {
        console.log("Signup failed. No user returned.");
      }
    } catch (error) {
      console.log("Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  function validateInputs() {
    let valid = true;
  
    // Reset error messages
    setEmailError("");
    setPasswordError("");
  
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
  
    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }
  
    return valid;
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("@/assets/images/Paper_texture.png")}
    >
      <ImageBackground 
        style={[styles.decoImg, styles.decoTopPosition]}
        source={require("@/assets/images/doodle.png")}
      />
      <ImageBackground 
        style={[styles.decoImg, styles.decoCenterPosition]}
        source={require("@/assets/images/doodle2.png")}
      />
      <ImageBackground 
        style={[styles.decoImg, styles.decoBottomPosition]}
        source={require("@/assets/images/doodle.png")}
      />
      <View style={styles.mainWrapper}>
        <View style={styles.mainTitleWrapper}>
          <Text style={GlobalStyles.appText1}>________'s FAV</Text>
          <Text style={GlobalStyles.appText2}>Random</Text>
          <Text style={GlobalStyles.appText2}>Game</Text>
        </View>
        <View style={styles.loginFormWrapper}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLable}>Email</Text>
            <TextInput
              style={[
                styles.input,
                isFocused ? styles.inputFocused : styles.input,
              ]}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="youremail@email.com"
              autoCapitalize={"none"}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLable}>Password</Text>
            <TextInput
              style={[
                styles.input,
                isFocused ? styles.inputFocused : styles.input,
              ]}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Minimum 6 characters"
              autoCapitalize={"none"}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
        </View>
        <View>
          <CustomButton
            text={"Sign up"}
            onPress={() => signUpWithEmail()}
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
  mainWrapper:{
    width: width * 0.8,
    maxWidth: 450,
  },
  mainTitleWrapper: {
    marginBottom: 36,
  },
  loginFormWrapper:{
    marginBottom: 40,
  },
  inputWrapper:{
    marginBottom: 20,
  },
  inputLable:{
    fontFamily: "GmarketSansMedium",
    fontSize: 12,
    color: "#FF00A1",
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
  decoImg:{
    width: width * 0.6,
    aspectRatio: 1/1,
    position: 'absolute',
  },
  decoTopPosition:{
    top: -60,
    left: -100,
  },
  decoCenterPosition:{
    top: height * 0.4,
    right: -70,
    transform: [{ rotate: '80deg' }]
  },
  decoBottomPosition:{
    bottom: -80,
    left: 0,
  },
  errorText: {
    fontSize: 10,
    color: "#57BEF7",
    marginTop: 4,
    fontFamily: "GmarketSansMedium",
  },
});
