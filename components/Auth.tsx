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

  // Sign in with email
  async function signInWithEmail() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Optionally check if the user's email exists in the profiles table
      const userId = data.user.id;
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert([{ id: userId, email: email, updated_at: new Date() }]);

      if (upsertError) throw upsertError;

      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
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
        const userId = data.user.id;

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

        Alert.alert("Success", "Signup successful!");
      } else {
        Alert.alert("Error", "Signup failed. No user returned.");
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Signup failed.");
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
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
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
