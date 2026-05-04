import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=fr-FR`,
    )
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E21221" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loading}>
        <Text style={styles.error}>Film introuvable</Text>
      </View>
    );
  }

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.backdrop} />

        <LinearGradient
          colors={["transparent", "rgba(15,17,26,0.8)", "#0F111A"]}
          style={styles.gradient}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.statsRow}>
          <Ionicons name="star" size={16} color="#FFAB2E" />
          <Text style={styles.rating}>
            {movie.vote_average?.toFixed(1)} / 10
          </Text>
          <Text style={styles.date}>{movie.release_date}</Text>
        </View>

        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={24} color="white" />
          <Text style={styles.playText}>Regarder</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.description}>
          {movie.overview || "Aucune description disponible."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F111A" },
  loading: {
    flex: 1,
    backgroundColor: "#0F111A",
    justifyContent: "center",
    alignItems: "center",
  },
  error: { color: "white", fontSize: 18 },
  header: { height: 450, width: "100%" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  gradient: { ...StyleSheet.absoluteFillObject },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  content: { padding: 20, marginTop: -50 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  rating: { color: "#FFAB2E", fontWeight: "600" },
  date: { color: "#B0B0B0" },
  playButton: {
    backgroundColor: "#E21221",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  playText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: "white",
    lineHeight: 22,
    opacity: 0.8,
  },
});
