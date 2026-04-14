import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const API_KEY = "TA_CLE_API";

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  const featured = movies[0];

  return (
    <ScrollView style={styles.container}>
      
      {/* 🔥 BANNER */}
      {featured && (
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w780${featured.backdrop_path}`,
            }}
            style={styles.banner}
          />

          <View style={styles.overlay}>
            <Text style={styles.title}>{featured.title}</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>▶ Watch Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🎬 SECTION */}
      <Text style={styles.section}>Mi lista</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map((movie) => (
          <Image
            key={movie.id}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.poster}
          />
        ))}
      </ScrollView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0f',
  },

  banner: {
    width: '100%',
    height: 250,
  },

  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#ff2c2c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  section: {
    color: 'white',
    fontSize: 18,
    margin: 15,
  },

  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});