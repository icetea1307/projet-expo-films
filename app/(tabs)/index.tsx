import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`,
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []));
  }, []);

  const featured = movies[0];

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.mobileContainer}>
        {featured && (
          <View style={styles.hero}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${featured.backdrop_path}`,
              }}
              style={styles.heroImage}
            />

            <View style={styles.heroOverlay} />

            <View style={styles.topBar}>
              <Ionicons name="menu" size={22} color="white" />
              <Ionicons name="search" size={20} color="white" />
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.smallLabel}>Film</Text>
              <Text style={styles.heroTitle}>{featured.title}</Text>
              <Text style={styles.heroText} numberOfLines={3}>
                {featured.overview ||
                  "Découvrez ce film populaire dès maintenant."}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Ma liste</Text>

        <FlatList
          ref={listRef}
          data={movies.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/movie/[id]",
                params: { id: String(item.id) },
              }}
              asChild
            >
              <TouchableOpacity style={styles.smallCard}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.smallPoster}
                />
              </TouchableOpacity>
            </Link>
          )}
        />

        <Text style={styles.sectionTitle}>Seulement sur Movie+</Text>

        <View style={styles.featureRow}>
          {movies.slice(8, 10).map((movie) => (
            <Link
              key={movie.id}
              href={{
                pathname: "/movie/[id]",
                params: { id: String(movie.id) },
              }}
              asChild
            >
              <TouchableOpacity style={styles.bigCard}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}
                  style={styles.bigPoster}
                />
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreText}>EXPLORER</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Nouveautés</Text>

        <FlatList
          data={movies.slice(10, 18)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `new-${item.id}`}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/movie/[id]",
                params: { id: String(item.id) },
              }}
              asChild
            >
              <TouchableOpacity style={styles.smallCard}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.smallPoster}
                />
              </TouchableOpacity>
            </Link>
          )}
        />

        <Text style={styles.sectionTitle}>Films populaires</Text>

        <View style={styles.grid}>
          {movies.slice(0, 6).map((movie) => (
            <Link
              key={`top-${movie.id}`}
              href={{
                pathname: "/movie/[id]",
                params: { id: String(movie.id) },
              }}
              asChild
            >
              <TouchableOpacity style={styles.gridCard}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}
                  style={styles.gridPoster}
                />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#080611",
  },

  mobileContainer: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: "#080611",
    minHeight: "100%",
  },

  hero: {
    height: 360,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  topBar: {
    position: "absolute",
    top: 45,
    left: 18,
    right: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  heroContent: {
    position: "absolute",
    bottom: 35,
    left: 22,
    right: 22,
    alignItems: "center",
  },

  smallLabel: {
    color: "#ddd",
    fontSize: 12,
    marginBottom: 4,
  },

  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  heroText: {
    color: "#ddd",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },

  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 18,
  },

  horizontalList: {
    paddingHorizontal: 18,
  },

  smallCard: {
    marginRight: 12,
  },

  smallPoster: {
    width: 95,
    height: 135,
    borderRadius: 14,
  },

  featureRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    gap: 14,
  },

  bigCard: {
    flex: 1,
  },

  bigPoster: {
    width: "100%",
    height: 170,
    borderRadius: 16,
  },

  exploreButton: {
    backgroundColor: "#6C2BFF",
    marginHorizontal: 55,
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 2,
  },

  exploreText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 13,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    gap: 12,
    paddingBottom: 30,
  },

  gridCard: {
    width: "30.5%",
  },

  gridPoster: {
    width: "100%",
    height: 145,
    borderRadius: 14,
  },
});
