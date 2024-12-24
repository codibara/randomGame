import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import { Session } from "@supabase/supabase-js";
import Main from "@/components/Main";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      if (sessionData.session) {
        await getProfile(sessionData.session.user.id);
      }
      setLoading(false); 
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          await getProfile(session.user.id);
        }
        setLoading(false);
      }
    );
  }, []);

  async function getProfile(userId: string) {
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        console.log("Username:", data.username);
        setIsProfileComplete(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching user profile:", error.message);
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <>
          {!isProfileComplete && (
            <View style={styles.content}>
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          )}
          {isProfileComplete && (
            <View style={styles.mainContent}>
              <Main username={username || "User"} />
            </View>
          )}
        </>
      ) : (
        <View style={styles.authContainer}>
          <Auth onUsernameFetch={setUsername} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  authContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
});
