import { router } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://wallpapers.com/images/hd/spider-man-miles-morales-4k-w4wbs0yqedqwe2r7.jpg",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>LES MEILLEURS{"\n"}FILMS POUR VOUS</Text>

        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.description}>
          Découvrez les films les plus populaires, les nouveautés et vos
          favoris. Recherchez facilement un film et consultez ses détails.
        </Text>

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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#050016",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 0, 30, 0.5)",
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 26,
    lineHeight: 32,
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
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  description: {
    color: "#E5E5E5",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 30,
  },
  primaryButton: {
    width: "100%",
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
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#8A2BFF",
    paddingVertical: 14,
    marginBottom: 14,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  outlineText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});