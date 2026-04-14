import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
};

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=fr-FR`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((error) => console.log('Erreur API:', error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Film introuvable</Text>
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : posterUrl;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: backdropUrl }} style={styles.backdrop} />

      <View style={styles.content}>
        <Image source={{ uri: posterUrl }} style={styles.poster} />

        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.infoText}>📅 {movie.release_date || 'N/A'}</Text>
          <Text style={styles.infoText}>⏱ {movie.runtime || 0} min</Text>
        </View>

        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.overview}>
          {movie.overview || 'Aucune description disponible.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
  backdrop: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 16,
    marginTop: -60,
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: 14,
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 8,
  },
  infoText: {
    color: '#d1d1d1',
    fontSize: 13,
  },
  sectionTitle: {
    color: '#E50914',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overview: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
  },
});