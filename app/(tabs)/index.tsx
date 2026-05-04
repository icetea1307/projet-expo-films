import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  const featured = movies[0];

  const scrollRight = () => {
    scrollPosition.current += 500;
    scrollRef.current?.scrollTo({
      x: scrollPosition.current,
      animated: true,
    });
  };

  const scrollLeft = () => {
    scrollPosition.current = Math.max(0, scrollPosition.current - 500);
    scrollRef.current?.scrollTo({
      x: scrollPosition.current,
      animated: true,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {featured && (
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w780${featured.backdrop_path}`,
            }}
            style={styles.banner}
          />

          <View style={styles.gradient} />

          <View style={styles.overlay}>
            <Text style={styles.title}>{featured.title}</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>▶ Regarder</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.section}>Ma liste</Text>

      <View style={styles.sliderContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.movieScroll}
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={{ pathname: '/movie/[id]', params: { id: String(movie.id) } }}
              asChild
            >
              <TouchableOpacity>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}
                  style={styles.poster}
                />
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}>
          <Ionicons name="chevron-forward" size={28} color="white" />
        </TouchableOpacity>
      </View>
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
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    color: 'white',
    fontSize: 18,
    margin: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieScroll: {
    flex: 1,
  },
  arrowButton: {
    width: 42,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 15,
    marginHorizontal: 8,
  },
});