import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button";

export function Confirmation() {
  return(
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.content}>
            😁
        </Text>
        <Text style={styles.title}>
            Agora vamos começar a cuidar das suas plantas
        </Text>
        <Button title="Começar"/>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  }
  content:{

  },
  title:{

  },

});