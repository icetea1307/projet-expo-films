import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Films populaires</Text>

      <FlatList
        data={movies}
        numColumns={2}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <Link
  href={{ pathname: '/movie/[id]', params: { id: String(item.id) } }}
  asChild
>
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.image}
              />
              <Text style={styles.movieTitle}>{item.title}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 22,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  movieTitle: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
});