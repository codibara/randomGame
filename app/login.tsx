import React from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground } from "react-native";

import CustomButton from "@/components/ui/button";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function Login() {
    return(
        <ImageBackground 
          style={styles.container}
          source={require("@/assets/images/Paper_texture.png")}
        >
            <View style={styles.mainTitleWrapper}>
            <Text style={styles.appText1}>________'s FAV</Text>
            <Text style={styles.appText2}>Random Game</Text>
          </View>
          <View style={styles.playButton}>
              <CustomButton 
                  text={'GOOGLE'}
                  onPress={()=>router.push('/settings')}
                  iconName={'logo-google'}
              />
          </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
    },
    mainTitleWrapper: {
        width: width * 0.9,
        marginTop: height * 0.3,
        maxWidth: 450,
      },
    appText1: {
        fontFamily: "HakgyoansimBold600",
        fontSize: 32,
        textTransform: 'uppercase',
    },
    appText2: {
        fontFamily: "HakgyoansimBold600",
        fontSize: 40,
        marginBottom: 30,
        textTransform: 'uppercase',
    },
    playButton: {
        position: 'absolute',
        bottom: 56,
        width: width * 0.9,
        maxWidth: 400,
    },
});