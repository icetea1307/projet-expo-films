import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken, // <-- AJOUT 1: Nécessaire pour la détection du scroll
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "LES MEILLEURS\nFILMS POUR VOUS",
    description:
      "Découvrez les films les plus populaires, les nouveautés et vos favoris.",
    image:
      "https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
  },
  {
    id: "2",
    title: "RECHERCHEZ\nVOS FILMS",
    description:
      "Trouvez rapidement un film et consultez toutes ses informations.",
    image:
      "https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
  },
  {
    id: "3",
    title: "VOTRE CINÉMA\nDANS LA POCHE",
    description:
      "Explorez Ninja+ et accédez à votre catalogue de films facilement.",
    image:
      "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const timerRef = useRef<number | null>(null); // <-- AJOUT 2: Pour gérer l'autoplay sans bug

  const goToSlide = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    setCurrentIndex(index);
  };

  // --- DÉBUT DES MODIFICATIONS DE LOGIQUE ---

  // Détecte précisément l'image affichée à l'écran
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  // Obligatoire pour que scrollToIndex fonctionne parfaitement
  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  // Autoplay corrigé
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
        listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  // --- FIN DES MODIFICATIONS DE LOGIQUE ---

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        
        // --- NOUVELLES PROPS AJOUTÉES ICI ---
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollBeginDrag={() => {
          // Coupe l'autoplay si l'utilisateur glisse le doigt
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        // ------------------------------------

        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.slide}
            resizeMode="cover"
          >
            <View style={styles.overlay} />

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>

              <View style={styles.dots}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentIndex === index && styles.dotActive,
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          </ImageBackground>
        )}
      />

      {/* TOUT LE RESTE EST EXACTEMENT TON CODE */}

      <TouchableOpacity
        style={[styles.arrow, styles.leftArrow]}
        onPress={() =>
          goToSlide(currentIndex === 0 ? slides.length - 1 : currentIndex - 1)
        }
      >
        <Ionicons name="chevron-back" size={34} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.arrow, styles.rightArrow]}
        onPress={() =>
          goToSlide(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)
        }
      >
        <Ionicons name="chevron-forward" size={34} color="white" />
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/create-account" as any)}
        >
          <Text style={styles.primaryText}>S’abonner à Ninja+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/login" as any)}
        >
          <Text style={styles.outlineText}>Déjà abonné à Ninja+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/login" as any)}
        >
          <Text style={styles.outlineText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050016" },
  slide: { width, height, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 0, 30, 0.52)",
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 250,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  dots: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  dotActive: { backgroundColor: "white" },
  description: {
    color: "#E5E5E5",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  arrow: {
    position: "absolute",
    top: "45%",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  leftArrow: { left: 15 },
  rightArrow: { right: 15 },
  buttons: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 40,
  },
  primaryButton: {
    backgroundColor: "#7B22FF",
    paddingVertical: 15,
    marginBottom: 14,
    borderRadius: 4,
  },
  primaryText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#8A2BFF",
    paddingVertical: 14,
    marginBottom: 14,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  outlineText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});