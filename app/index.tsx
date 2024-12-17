import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { Session } from "@supabase/supabase-js";
import Main from "@/components/Main";
import { Text, StyleSheet, View, Button } from "react-native";

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

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUsername(null);
    setIsProfileComplete(false);
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <>
          <Text style={styles.username}>Welcome, {username || "User"}!</Text>

          {!isProfileComplete && (
            <View style={styles.content}>
              <Account
                key={session.user.id}
                session={session}
                onUsernameFetch={setUsername}
              />
            </View>
          )}

          {isProfileComplete && (
            <View style={styles.mainContent}>
              <Main />
            </View>
          )}

          <View style={styles.signOutContainer}>
            <Button title="Sign Out" onPress={handleSignOut} />
          </View>
        </>
      ) : (
        <View style={styles.authContainer}>
          <Auth />
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
    padding: 20,
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
  list: {
    fontSize: 20,
    fontWeight: "bold",
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
