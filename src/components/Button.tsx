import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export interface ButtonProps extends TouchableOpacityProps {
  title: String;
}

export function Button({ title }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    borderRadius: 10,
    height:56,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.text,
  },
});
