import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { useRouter, usePathname } from "expo-router";
import gameData from "@/assets/data/gameData.json";
import { Ionicons } from "@expo/vector-icons";
import { MenuItemButton } from "./ui/menuItembutton";

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
                    <MenuItemButton
                            label="Main Page"
                            iconName="home"
                            isActive={pathname === `/`}
                            onPress={() => {
                                handler();
                                router.push(`/`);
                            }}
                        />
                    <MenuItemButton
                        label="Settings"
                        iconName="settings"
                        isActive={pathname === `/settings`}
                        onPress={() => {
                            handler();
                            router.push(`/settings`);
                        }}
                    />
                    {games.map((game, index) => (
                        <MenuItemButton
                            key={index}
                            label={game.EngName}
                            isActive={pathname === `/game/${game.id}`}
                            onPress={() => {
                                handler();
                                router.push(`/game/${game.id}`);
                            }}
                        />
                    ))}
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
        backgroundColor: '#E60091',
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
  });