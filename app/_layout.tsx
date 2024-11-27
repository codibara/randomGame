import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  StatusBar as RNStatusBar,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("window").width;

// Prevent the splash screen from auto-hiding on load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    const prepareApp = async () => {
      if (loaded) {
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
  }, [loaded]);

  if (!loaded || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("@/assets/images/Screenshot.png")}
          style={styles.logo}
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen 
          name="game/[id]" 
          options={{ 
            headerTitle: "",
            headerTransparent: true,
          }}
        />
      </Stack>
      <RNStatusBar />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  headerBackground: {
    flex: 1,
    height: 100, // Adjust the header height here
  },
});
