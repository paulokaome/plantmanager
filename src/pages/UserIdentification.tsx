import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import { Button } from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function UserIdentification() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();

  const navigation = useNavigation();


  const handleInputBlur = () => {
    setIsFocused(false);
    setIsFilled(!!name);
  };
  const handleInputFocus = () => {
    setIsFocused(true);
  };
  const handleInputChange = (value: string) => {
    setIsFilled(!!value);
    setName(value);
  };
  const handleSubmit = async () => {
    if (!name) return Alert.alert("Me diz como chamar você?😊");

    await AsyncStorage.setItem("@plantmanager:user", name);

    navigation.navigate('Confirmation', {
      title: 'Prontinho',
      subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
      buttonTitle: 'Começar',
      icon: 'smile',
      nextScreen: 'PlantSelect'
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>{isFilled ? "😄" : "🙂"}</Text>
                <Text style={styles.titleText}>
                  Como podemos {"\n"} chamar você?
                </Text>
              </View>
              <TextInput
                placeholder="Digite seu nome"
                style={[
                  styles.input,
                  (isFocused || isFilled) && { borderColor: colors.green },
                ]}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
              />
              <View style={styles.footer}>
                <Button title="Confirmar" onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 54,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 44,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: "100%",
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: "center",
  },
  titleText: {
    fontSize: 24,
    marginTop: 24,
    color: colors.heading,
    fontFamily: fonts.heading,
    textAlign: "center",
    lineHeight: 32,
  },
  footer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
});
