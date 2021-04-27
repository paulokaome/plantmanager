import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { useNavigation, useRoute } from '@react-navigation/core';
import { SvgFromUri } from "react-native-svg";
import WaterDrop from "../assets/waterdrop.png";
import { Button } from "../components/Button";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { format, isBefore } from "date-fns";
import { loadPlant, PlantProps, savePlant } from "../libs/storage";

interface Params {
  plant: PlantProps;
}

export function PlantSave() {
  const route = useRoute();
  const { plant } = route.params as Params;
  const navigation = useNavigation();

  const [selectedDateTime, setSelectedDatetime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  const handleChangeTime = (event: Event, dateTime: Date | undefined) => {
    if (Platform.OS === "android") {
      setShowDatePicker((oldState) => !oldState);
    }
    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDatetime(new Date());
      return Alert.alert("Escolha uma hora no Futuro! 🧭");
    }
    if (dateTime) {
      setSelectedDatetime(dateTime);
    }
  };

  const handleOpenDateTimePickerForAndroid = () => {
    setShowDatePicker((oldState) => !oldState);
  };

  const handleSavePlant = async () => {
    const data = await loadPlant();
    console.log(data);
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });
      navigation.navigate('Confirmation', {
        title: 'Tudo Certo',
        subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
        buttonTitle: 'Muito Obrigado :D',
        icon: 'hug',
        nextScreen: 'MyPlants'
      });
    } catch (error) {
      Alert.alert("Nao Foi possivel Salvar! 😢");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.plantinfo}>
        <SvgFromUri uri={plant.photo} height={200} width={200} />

        <Text style={styles.plantname}>{plant.name}</Text>
        <Text style={styles.plantabout}>{plant.about}</Text>
      </View>

      <View style={styles.controller}>
        <View style={styles.tipcontainer}>
          <Image source={WaterDrop} style={styles.tipimage} />
          <Text style={styles.tiptext}>{plant.water_tips}</Text>
        </View>

        <Text style={styles.alertlabel}>
          Escolha o melhor horário para ser lembrado:
        </Text>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDateTime}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
        )}
        {Platform.OS === "android" && (
          <TouchableOpacity
            style={styles.dateTimePickerButton}
            onPress={handleOpenDateTimePickerForAndroid}
          >
            <Text style={styles.dateTimePickerTexT}>{`Mudar ${format(
              selectedDateTime,
              "HH:mm"
            )}`}</Text>
          </TouchableOpacity>
        )}

        <Button title="Cadastrar Planta" onPress={handleSavePlant} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.shape,
  },
  plantinfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.shape,
  },
  plantname: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantabout: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  tipcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: "relative",
    bottom: 60,
  },
  tipimage: {
    width: 56,
    height: 56,
  },
  tiptext: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: "justify",
  },
  alertlabel: {
    textAlign: "center",
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  dateTimePickerTexT: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
