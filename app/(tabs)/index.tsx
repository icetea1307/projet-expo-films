import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_KEY = "f3d3ad9ea60a687311952816106b86a3";
const { width } = Dimensions.get("window");

const menuItems = [
  { label: "Séries", route: "/" },
  { label: "Films", route: "/" },
  { label: "Originaux", route: "/" },
  { label: "Nouveautés", route: "/" },
  { label: "Derniers jours", route: "/" },
  { label: "À venir", route: "/" },
  { label: "Genres", route: "/" },
];

const menuLogos = [
  { uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Warner_Bros._logo.svg/512px-Warner_Bros._logo.svg.png", label: "WB" },
  { uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Paramount_Pictures_logo.svg/512px-Paramount_Pictures_logo.svg.png", label: "Paramount" },
  { uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Universal_Pictures_logo.svg/512px-Universal_Pictures_logo.svg.png", label: "Universal" },
  { uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Columbia_Pictures_logo.svg/512px-Columbia_Pictures_logo.svg.png", label: "Columbia" },
  { uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lionsgate_logo.svg/512px-Lionsgate_logo.svg.png", label: "Lionsgate" },
];

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const heroSlides = movies.slice(0, 3);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`,
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []));
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;

    autoScrollTimer.current = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => {
        const nextIndex = prevIndex >= heroSlides.length - 1 ? 0 : prevIndex + 1;
        listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3500);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [heroSlides.length]);

  const featured = heroSlides[currentHeroIndex] || heroSlides[0];

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.mobileContainer}>
        {heroSlides.length > 0 && (
          <View style={styles.heroCarouselWrapper}>
            <FlatList
              ref={listRef}
              data={heroSlides}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              onMomentumScrollEnd={(event) => {
                const currentIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentHeroIndex(currentIndex);
              }}
              onScrollBeginDrag={() => {
                if (autoScrollTimer.current) {
                  clearInterval(autoScrollTimer.current);
                }
              }}
              scrollEventThrottle={16}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <View style={[styles.hero, { width }]}> 
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
                    }}
                    style={styles.heroImage}
                  />

                  <View style={styles.heroOverlay} />

                  <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => setMenuOpen(true)}>
                      <Ionicons name="menu" size={22} color="white" />
                    </TouchableOpacity>
                    <Ionicons name="search" size={20} color="white" />
                  </View>

                  <View style={styles.heroContent}>
                    <Text style={styles.smallLabel}>Film</Text>
                    <Text style={styles.heroTitle}>{item.title}</Text>
                    <Text style={styles.heroText} numberOfLines={3}>
                      {item.overview ||
                        "Découvrez ce film populaire dès maintenant."}
                    </Text>
                  </View>
                </View>
              )}
            />
            <View style={styles.dotsContainer}>
              {heroSlides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentHeroIndex === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {menuOpen && (
          <View style={styles.menuOverlay}>
            <TouchableOpacity style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
            <View style={styles.menuPane}>
              <TouchableOpacity style={styles.menuCloseButton} onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuItemButton}
                  onPress={() => {
                    setMenuOpen(false);
                    router.push(item.route);
                  }}
                >
                  <Text style={styles.menuItem}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.menuSeparator} />
              <View style={styles.menuLogos}>
                {menuLogos.map((logo) => (
                  <Image
                    key={logo.label}
                    source={{ uri: logo.uri }}
                    style={styles.menuLogo}
                    resizeMode="contain"
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Ma liste</Text>

        <FlatList
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

  carouselWrapper: {
    marginVertical: 16,
  },

  carouselFlatList: {
    height: 280,
  },

  carouselCard: {
    width: 280,
    height: 280,
  },

  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: "white",
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    flexDirection: "row",
  },

  menuBackdrop: {
    flex: 1,
  },

  menuPane: {
    width: "72%",
    maxWidth: 300,
    height: "100%",
    backgroundColor: "#0B0520",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  menuCloseButton: {
    position: "absolute",
    top: 18,
    right: 18,
  },

  menuItemButton: {
    paddingVertical: 12,
  },

  menuItem: {
    color: "white",
    fontSize: 16,
    marginBottom: 0,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  menuSeparator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 18,
  },

  menuLogos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  menuLogo: {
    width: "48%",
    height: 48,
    marginBottom: 12,
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
