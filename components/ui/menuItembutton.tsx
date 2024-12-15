import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MenuItemProps = {
    label: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
    onPress: () => void;
};

export function MenuItemButton({ label, iconName, isActive, onPress }: MenuItemProps) {
    return (
        <TouchableOpacity
            style={[
                styles.menuItem,
                isActive && styles.activeMenuItem,
            ]}
            onPress={onPress}
        >
            <View style={styles.menuItemIcon}>
                {iconName && (
                    <Ionicons
                        name={iconName}
                        size={20}
                        color={isActive ? "#010101" : "#ffffff"}
                        style={{ width: 24 }}
                    />
                )}
                <Text style={[
                    styles.menuLink,
                    isActive && styles.activeMenuLink,
                ]}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        backgroundColor: '#010101',
    },
    activeMenuItem: {
        backgroundColor: "#57BEF7",
    },
    menuItemIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuLink: {
        fontFamily: 'GmarketSansMedium',
        fontSize: 16,
        color: '#E9E9E9',
        textAlign: 'center',
    },
    activeMenuLink: {
        color: '#101010',
    },
});
