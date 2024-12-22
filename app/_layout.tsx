import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useRef} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Share,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import Menu from "@/components/menu";

const screenWidth = Dimensions.get("window").width;

// Prevent the splash screen from auto-hiding on load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    GmarketSansBold: require("@/assets/fonts/GmarketSansTTFBold.ttf"),
    GmarketSansLight: require("@/assets/fonts/GmarketSansTTFLight.ttf"),
    GmarketSansMedium: require("@/assets/fonts/GmarketSansTTFMedium.ttf"),
    HakgyoansimBold600: require("@/assets/fonts/HakgyoansimMoheomgaB.ttf"),
  });
  const [showSplash, setShowSplash] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(-screenWidth)).current;

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
        //console.log("Username:", data.username);
        setIsProfileComplete(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching user profile:", error.message);
      }
    }
  }

  //Drawer Manu Toogle Handler
  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuAnimation, {
        toValue: -screenWidth, // Slide out
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 0, // Slide in
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    const prepareApp = async () => {
      if (fontsLoaded) {
        // Hide splash screen after fonts are loaded
        await SplashScreen.hideAsync();
        // Set splash timeout
        timer = setTimeout(() => setShowSplash(false), 3000);
      }
    };

    prepareApp();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [fontsLoaded]);

  if (!fontsLoaded || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("@/assets/images/splashLogo.png")}
          style={styles.logo}
        />
      </View>
    );
  }

  //share playstore link (will be added to the share icon)
  const handleShare = async () => {
    try {
      const appLink = "https://play.google.com/store/apps/details?id=com.trello"; // Will be eplace with App Store or Play Store URL

      const result = await Share.share({
        title: "Download Our App",
        message: `Check out this amazing app! Download it here: ${appLink}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing app link:", error);
    }
  };



  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={styles.drawer}>
          {/* Sliding Drawer Menu */}
          <Animated.View
            style={[
              styles.menu,
              { transform: [{ translateX: menuAnimation }] },
            ]}
          >
          <Menu handler={toggleMenu}/>
          </Animated.View>

          {/* Overlay */}
          {menuVisible && (
            <TouchableWithoutFeedback onPress={toggleMenu}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )}
          
          {/* Navigation */}
          <Stack
            screenOptions={{
              //headerStyle: { backgroundColor: '#E9E9E9' },
              headerStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{
                headerShown: !!session, 
                headerTitle: "",
                headerTransparent: true,
                headerBackVisible: false,
                headerLeft: () => (
                  <Ionicons
                    name="menu-outline" 
                    size={24} 
                    color="#000"
                    onPress={toggleMenu}
                    style={{backgroundColor: '#ffffff', padding: 8, borderRadius: 30, borderWidth: 1, borderColor: "#FF00A1"}}
                  />
                ),
                headerRight: () => (
                  <Ionicons
                    name="share-social-outline" 
                    size={24} 
                    color="#000"
                    onPress={handleShare}
                  />
                )
              }}
            />
            <Stack.Screen 
              name="game/[id]" 
              options={{ 
                headerTitle: "",
                headerTransparent: true,
                headerBackVisible: false,
                headerLeft: () => (
                  <Ionicons
                    name="menu-outline" 
                    size={24} 
                    color="#000"
                    onPress={toggleMenu}
                  />
                ),
                headerRight: () => (
                  <Ionicons
                    name="share-social-outline" 
                    size={24} 
                    color="#000"
                    onPress={handleShare}
                  />
                )
              }}
            />
            <Stack.Screen 
              name="settings" 
              options={{ 
                headerTitle: "SETTINGS",
                headerTransparent: true,
                headerBackVisible: false,
                headerTitleAlign: "center", 
                headerLeft: () => (
                  <Ionicons
                    name="menu-outline" 
                    size={24} 
                    color="#000"
                    onPress={toggleMenu}
                  />
                ),
                headerRight: () => (
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color="#000"
                    onPress={async () => {
                      try {
                        const { error } = await supabase.auth.signOut();
                        if (error) throw error;
                        router.push("/");
                      } catch (error) {
                        console.error("Error logging out:", error);
                      }
                    }}
                    style={{ marginRight: 10 }}
                  />
                ),
              }}
            />
          </Stack>
        </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#010101",
  },
  logo: {
    width: screenWidth,
    aspectRatio: 1/1,
    resizeMode: "contain",
  },
  drawer: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: screenWidth * 0.70,
    backgroundColor: "#010101",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 5,
    borderTopRightRadius: 36,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 5,
  },
});
