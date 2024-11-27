import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import Menu from "@/components/menu";

const screenWidth = Dimensions.get("window").width;

// Prevent the splash screen from auto-hiding on load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showSplash, setShowSplash] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(-screenWidth)).current;

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
            headerStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen 
            name="index" 
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
                />
              )
            }}
          />
          <Stack.Screen 
            name="game/[id]" 
            options={{ 
              headerTitle: "",
              headerTransparent: true,
              headerBackVisible: true,
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
                />
              )
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
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  headerBackground: {
    flex: 1,
    height: 100,
  },
  drawer: {
    flex: 1,
    backgroundColor: "#3F3F3F",
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: screenWidth * 0.70,
    backgroundColor: "#3F3F3F",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 5,
    padding: 16,
    borderTopRightRadius: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 5,
  },
});
