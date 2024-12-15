import { View, Text, StyleSheet, TextInput, ImageBackground} from "react-native";
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

import CustomButton from "@/components/ui/button";

export default function settings() {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const isButtonDisabled = inputValue.trim() === '';
    const router = useRouter(); 

    //update the nickname
    useEffect(() => {
      const fetchNickname = async () => {
        try {
          const savedNickname = await AsyncStorage.getItem("nickname");
          if (savedNickname) {
            setInputValue(savedNickname);
          }
        } catch (error) {
          console.error("Error fetching nickname:", error);
        }
      };
  
      fetchNickname();
    }, []);

    //save the nickname
    const handleSave = async () => {
      try {
        await AsyncStorage.setItem('nickname', inputValue.trim());
        router.push("/");
      } catch (error) {
        console.error('Error saving nickname:', error);
      }
    };


    return (
        <ImageBackground 
          style={styles.container}
          source={require("@/assets/images/Paper_texture.png")}
        >
            <View style={styles.wrapper}>
              <View style={styles.content}>
              <Text style={styles.heading}>Nickname</Text>
                <View>
                  <TextInput 
                    value={inputValue}
                    placeholder={inputValue && "Tap here to enter"}
                    style={[styles.input,
                      isFocused ? styles.inputFocused : styles.input]}
                    maxLength={10}
                    onFocus={() => setIsFocused(true)} 
                    onBlur={() => setIsFocused(false)}
                    onChangeText={(text) => setInputValue(text)} 
                  />
                  <Text style={styles.characterCounter}>{inputValue.length}/10 Characters</Text>
                </View>
                <View>
                  <Text style={styles.helperText}>• A miximum length of 10 Characters</Text>
                  <Text style={styles.helperText}>• You can change your nickname later in settings.</Text>
                </View>
              </View>
              <CustomButton 
                  text={'SAVE'}
                  onPress={handleSave}
                  isDisabled={isButtonDisabled}
              />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginTop: 50,
    },
    wrapper: {
      width:'80%',
      maxWidth: 400,
      marginHorizontal: 40,
    },
    content:{
      display: 'flex',
      flexDirection: 'column',
      gap: 38,
      marginBottom: 52,
    },
    heading:{
      fontFamily: "GmarketSansBold",
      textAlign:'center',
      fontSize: 24,
    },
    input: {
      fontFamily: "GmarketSansMedium",
      height: 40,
      borderBottomWidth: 1,
      borderColor:'#848484',
      paddingVertical: 10,
      textDecorationLine: 'none',
    },
    inputFocused: {
      backgroundColor: '#D9D9D9', 
    },
    helperText:{
      fontFamily: "GmarketSansMedium",
      color: '#848484',
      paddingVertical: 4,
      fontSize: 12,
      lineHeight: 20,
    },
    characterCounter: {
      color: '#57BEF7',
      textAlign: 'right',
      fontSize: 10,
    },
  });
  