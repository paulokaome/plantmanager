import React from "react";
import { StyleSheet, Text, Image, View, Platform } from "react-native";

import { getStatusBarHeight } from "react-native-iphone-x-helper"

import UserImg from "../assets/me.jpg"

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Ola</Text>
        <Text style={styles.greetingName}>Paulo</Text>
      </View>

      <Image source={UserImg} style={styles.image}/>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios"? getStatusBarHeight() : 40,
  },
  image:{
    width:80,
    height:80,
    borderRadius:40,
  },
  greeting:{
    fontSize:32,
    color:colors.heading,
    fontFamily:fonts.text
  },
  greetingName:{
    fontSize:32,
    fontFamily:fonts.heading,
    color:colors.heading,
    lineHeight:40
  },
});
