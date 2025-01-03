import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import { Session } from "@supabase/supabase-js";
import Main from "@/components/Main";
import { Text, StyleSheet, View,} from "react-native";

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        getProfile(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getProfile(session.user.id);
      }
    });
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

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <>
          {!isProfileComplete && (
            <View style={styles.content}>
              <Auth onUsernameFetch={setUsername} />
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
  title: {
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  signOutContainer: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
});
