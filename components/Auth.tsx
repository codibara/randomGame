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
} from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router"; // Import useRouter for navigation

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
  const router = useRouter(); // Initialize useRouter

  // Sign in with email
  async function signInWithEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const userId = data.user?.id;

      if (!userId) throw new Error("User not found");

      // Fetch the user's username
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      if (profile?.username) {
        onUsernameFetch(profile.username); // Update the username in the parent
      }
      console.log("Username:", profile.username);

      // Navigate to the Settings screen
      router.push("/settings");
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Sign up with email
  async function signUpWithEmail() {
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
        console.log("Username:", userEmail);

        // Navigate to the Settings screen
        router.push("/settings");
      } else {
        console.log("Signup failed. No user returned.");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("@/assets/images/Paper_texture.png")}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.mainTitleWrapper}>
              <Text style={styles.appText1}>________'s FAV</Text>
              <Text style={styles.appText2}>Random Game</Text>
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Input
                label="Email"
                leftIcon={{ type: "font-awesome", name: "envelope" }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={"none"}
              />
            </View>
            <View style={styles.verticallySpaced}>
              <Input
                label="Password"
                leftIcon={{ type: "font-awesome", name: "lock" }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={"none"}
              />
            </View>
            <View style={styles.verticallySpaced}>
              <Button
                title="Sign up / Sign in"
                disabled={loading}
                onPress={() => signUpWithEmail()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  mainTitleWrapper: {
    width: width * 0.9,
    marginTop: height * 0.3,
    maxWidth: 450,
  },
  appText1: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 32,
    textTransform: "uppercase",
  },
  appText2: {
    fontFamily: "HakgyoansimBold600",
    fontSize: 40,
    marginBottom: 30,
    textTransform: "uppercase",
  },
});
