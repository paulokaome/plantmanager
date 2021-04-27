import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList ,ActivityIndicator } from "react-native";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import api from "../services/api";

import { Header } from "../components/Header";
import { EnviromentButton } from "../components/EnviromentButton";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";
import { useNavigation } from "@react-navigation/native";
import { PlantProps } from "../libs/storage";

interface EnviromentsProps {
  title: string;
  key: string;
}

export function PlantSelect() {
  const navigation = useNavigation();

  const [enviroments, setEnviroments] = useState<EnviromentsProps[]>([]);
  const [enviromentsSelected, setEnviromentsSelected] = useState("all");
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleEnviromentsSelected = (enviroment: string) => {
    setEnviromentsSelected(enviroment);
    if (enviroment === "all") return setFilteredPlants(plants);

    const filtered = plants.filter((plant) =>
      plant.environments.includes(enviroment)
    );
    setFilteredPlants(filtered);
  };

  const fetchPlants = async () => {
    const { data } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );
    if (!data) return setLoading(true);
    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldsValue) => [...oldsValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const handleFetchMore = (distance: number) => {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  };

  const handlePlantSelect = (plant : PlantProps) =>{
      navigation.navigate('PlantSave' , { plant });
  }

  useEffect(() => {
    async function fetchEnviroment() {
      const { data } = await api.get(
        "plants_environments?_sort=title&_order=asc"
      );
      setEnviroments([
        {
          title: "Todos",
          key: "all",
        },
        ...data,
      ]);
    }
    fetchEnviroment();
  }, []);

  useEffect(() => {
    fetchPlants()
  }, []);

  if (loading) return <Load />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <View>
          <Text style={styles.title}>Em qual ambiente</Text>
          <Text style={styles.subtitle}>Voce quer Colocar sua Planta?</Text>
        </View>
      </View>
      <View>
        <FlatList
          data={enviroments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={item.key === enviromentsSelected}
              onPress={() => handleEnviromentsSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PlantCardPrimary data={item} onPress={() => handlePlantSelect(item)}/>}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
          handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore?
            <ActivityIndicator color={colors.green}/>
            :
            <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    // justifyContent:"center",
    // alignItems:"center",
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 30,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  header: {
    paddingHorizontal: 30,
  },
  enviromentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});
