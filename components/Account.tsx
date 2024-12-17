import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";

// Automatically refresh Supabase session in the foreground
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign in or Sign up with email
  async function handleSignIn() {
    setLoading(true);
    try {
      // Try to sign in with existing credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          // If login fails, attempt to sign up
          const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
              email: email,
              password: password,
            });

          if (signUpError) throw signUpError;

          if (signUpData?.user) {
            const userId = signUpData.user.id;
            const userEmail = signUpData.user.email || email;

            // Upsert user profile in Supabase profiles table
            const { error: insertError } = await supabase
              .from("profiles")
              .upsert([
                {
                  id: userId,
                  email: userEmail,
                  username: userEmail, // Default username to email
                  updated_at: new Date(),
                },
              ]);

            if (insertError) throw insertError;

            Alert.alert(
              "Success",
              "Account created successfully! You are now signed in."
            );
          }
        } else {
          throw error;
        }
      } else {
        Alert.alert("Success", "Logged in successfully!");
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading..." : "Sign In / Sign Up"}
          disabled={loading}
          onPress={() => handleSignIn()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
