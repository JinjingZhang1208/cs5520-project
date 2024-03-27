import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../Colors";

export default function PressableButton({
  customStyle,
  onPress,
  disabled,
  children,
}) {
  return (
    <View style={{marginTop: '5%'}}>
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.defaultStyle,
        customStyle,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    borderRadius: 10,
    justifyContent: "center", 
    alignItems: "center", 
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    backgroundColor: Colors.inactiveBottomBarTab,
  },
});
