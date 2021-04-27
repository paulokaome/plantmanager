import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import colors from "../styles/colors";
import WaterDrop from "../assets/waterdrop.png";
import { FlatList } from "react-native-gesture-handler";
import { loadPlant, PlantProps, removePlant } from "../libs/storage";
import { formatDistance } from "date-fns/esm";
import { pt } from "date-fns/locale";
import fonts from "../styles/fonts";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";

export function MyPlants() {
  const [myPlant, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWatered, setNewWatered] = useState<string>();

  useEffect(() => {
    const loadStorage = async () => {
      const plantStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );
      setNewWatered(
        `Nao esqueca de regar a ${plantStoraged[0].name} em ${nextTime}`
      );
      setMyPlants(plantStoraged);
      setLoading(false);
    };
    loadStorage();
  }, []);

  const handleRemove = (plant: PlantProps) => {
    Alert.alert("Remover", `Deseja Remover a ${plant.name}`, [
      {
        text: "Não 😰",
        style: "cancel",
      },
      {
        text: "Sim 😓",
        onPress: async () => {
          try {
            await removePlant(plant.id);

            setMyPlants((oldData) =>
              oldData.filter((item) => item.id !== plant.id)
            );
          } catch (error) {
            Alert.alert("Não foi possível remover 😪 ");
          }
        },
      },
    ]);
  };

  if (loading) return <Load />;
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spot}>
        <Image source={WaterDrop} style={styles.spotImage} />
        <Text style={styles.spotText}>{newWatered}</Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantTitle}>Proximas Regadas</Text>

        <FlatList
          data={myPlant}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  spot: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotImage: {
    width: 60,
    height: 60,
  },
  spotText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: "justify",
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
