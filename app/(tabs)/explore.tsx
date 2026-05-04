import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const searchMovies = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setMovies([]);
      return;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${text}`,
    );

    const data = await res.json();
    setMovies(data.results || []);
  };

  return (
    <View style={styles.container}>
      {/* BARRE */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#8E8E93" />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#8E8E93"
          value={query}
          onChangeText={searchMovies}
        />
      </View>

      {/* RESULTATS */}
      {query.length >= 2 && movies.length === 0 && (
        <Text style={styles.noResult}>Aucun résultat</Text>
      )}

      <FlatList
        data={movies}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  searchBar: {
    height: 48,
    backgroundColor: "#15161A",
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 15,
  },
  noResult: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  title: {
    color: "white",
    marginTop: 5,
  },
});
