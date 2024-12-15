import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { useRouter, usePathname } from "expo-router";
import gameData from "@/assets/data/gameData.json";
import { Ionicons } from "@expo/vector-icons";

type MenuProps = {
    handler: () => void; // Function to toggle the menu
  };

export default function Menu({ handler }: MenuProps){
    const games = gameData.games;
    const router = useRouter(); 
    const pathname = usePathname();

    return(
        <View style={styles.menuContainer}>
            <View>
                <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>GAME LIST</Text>
                    <TouchableOpacity onPress={handler}>
                        <Ionicons
                            name="close-outline" 
                            size={24} 
                            color="#010101"
                            onPress={handler}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.menuItemWrapper}>
                    <TouchableOpacity 
                        style={[
                            styles.menuItem,
                            pathname === `/` && styles.activeMenuItem,
                          ]}
                        onPress={() => {
                            handler();
                            router.push(`/`);
                          }}
                    >
                        <Text style={[
                            styles.gameLink,
                            pathname === `/` && styles.activeGameLink,
                        ]}>Main Page</Text>
                    </TouchableOpacity>
                    {games.map((game, index) => {
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    styles.menuItem,
                                    pathname === `/game/${game.id}` && styles.activeMenuItem,
                                  ]}
                                onPress={() => {
                                    handler();
                                    router.push(`/game/${game.id}`);
                                  }}
                            >
                                    <Text style={[
                                        styles.gameLink,
                                        pathname === `/game/${game.id}` && styles.activeGameLink,
                                        ]}>{game.EngName}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity 
                        style={[
                            styles.menuItem,
                            pathname === `/settings` && styles.activeMenuItem,
                          ]}
                        onPress={() => {
                            handler();
                            router.push(`/settings`);
                          }}
                    >
                        <Text style={[
                            styles.gameLink, 
                            {color:'#FF00A1'},
                            pathname === `/settings` && styles.activeGameLink,
                        ]}>Settings</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
    },
    menuHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FF00A1',
        padding: 16,
        borderTopRightRadius: 36,
    },
    menuTitle:{
        fontFamily: 'GmarketSansBold',
        flex: 1,
        color: '#010101',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 16,
    },
    menuItemWrapper:{
        paddingVertical: 6,
    },
    menuItem:{
        flex:1,
        paddingVertical: 14,
        backgroundColor: '#010101',
    },
    activeMenuItem: {
        backgroundColor: "#57BEF7", 
    },
    gameLink: {
        fontFamily: 'GmarketSansMedium',
        fontSize: 16,
        color: '#E9E9E9',
        textAlign: 'center',
    },
    activeGameLink: {
        color: '#101010',
    },
  });