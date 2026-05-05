import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
};

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      setError("");

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`,
      );

      const data = await response.json();

      if (!data.results) {
        setMovies([]);
        setError("Impossible de récupérer les films.");
        return;
      }

      setMovies(data.results);
    } catch {
      setError("Erreur réseau. Vérifie ta connexion.");
      setMovies([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMovies();
  }, []);

  const featured = movies[0];

  const renderHeader = () => (
    <View>
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
            <Text style={styles.logo}>Ninja+</Text>
            <Ionicons name="search" size={20} color="white" />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.smallLabel}>Film populaire</Text>
            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroText} numberOfLines={3}>
              {featured.overview ||
                "Découvrez ce film populaire dès maintenant."}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Films populaires</Text>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <View key={item} style={styles.skeletonCard} />
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.page}>
        <View style={styles.mobileContainer}>
          <View style={styles.skeletonHero} />
          {renderSkeleton()}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.mobileContainer}>
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7B22FF"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              {error ? (
                <>
                  <Text style={styles.emptyTitle}>Erreur</Text>
                  <Text style={styles.emptyText}>{error}</Text>

                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchMovies}
                  >
                    <Text style={styles.retryText}>Réessayer</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.emptyTitle}>Aucun film</Text>
                  <Text style={styles.emptyText}>
                    Aucune donnée disponible.
                  </Text>
                </>
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.delay(index * 60)}
              style={styles.gridCard}
            >
              <Link
                href={{
                  pathname: "/movie/[id]",
                  params: { id: String(item.id) },
                }}
                asChild
              >
                <TouchableOpacity activeOpacity={0.8}>
                  <Image
                    source={{
                      uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image",
                    }}
                    style={styles.gridPoster}
                  />

                  <Text style={styles.movieTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          windowSize={7}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#080611",
  },

  mobileContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: "#080611",
  },

  hero: {
    height: 360,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
    position: "relative",
    marginBottom: 18,
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
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
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
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 18,
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 30,
  },

  gridRow: {
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 16,
  },

  gridCard: {
    flex: 1,
  },

  gridPoster: {
    width: "100%",
    height: 145,
    borderRadius: 14,
    backgroundColor: "#1A1725",
  },

  movieTitle: {
    color: "white",
    fontSize: 11,
    marginTop: 6,
  },

  emptyBox: {
    padding: 30,
    alignItems: "center",
  },

  emptyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyText: {
    color: "#aaa",
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#7B22FF",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 18,
  },

  retryText: {
    color: "white",
    fontWeight: "700",
  },

  skeletonHero: {
    height: 360,
    backgroundColor: "#1A1725",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    marginBottom: 25,
  },

  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    gap: 12,
  },

  skeletonCard: {
    width: "30.5%",
    height: 145,
    borderRadius: 14,
    backgroundColor: "#1A1725",
  },
});
