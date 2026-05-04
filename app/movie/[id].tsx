import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Pour les icônes Figma
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Ici tu feras ton fetch(API + id) plus tard
  const movie = {
    title: "Inception",
    description: "Your API description will go here...",
    rating: "8.8",
    image: "https://image.tmdb.org/t/p/w500/your_path.jpg"
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* 1. Image de fond avec dégradé */}
      <View style={styles.header}>
        <Image source={{ uri: movie.image }} style={styles.backdrop} />
        <LinearGradient
          colors={['transparent', 'rgba(15, 17, 26, 0.8)', '#0F111A']} // Adapte la couleur à ton Figma
          style={styles.gradient}
        />
        
        {/* Bouton Retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. Infos du film */}
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>{movie.title}</ThemedText>
        
        <View style={styles.statsRow}>
          <Ionicons name="star" size={16} color="#FFAB2E" />
          <Text style={styles.rating}>{movie.rating} (IMDb)</Text>
        </View>

        {/* 3. Bouton Play (Le gros bouton coloré de Figma) */}
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={24} color="white" />
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>

        <ThemedText style={styles.description}>
          {movie.description}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  header: { height: 450, width: '100%' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  gradient: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  content: { padding: 20, marginTop: -50 }, // Remonte un peu sur l'image
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  rating: { color: '#FFAB2E', marginLeft: 8, fontWeight: '600' },
  playButton: { 
    backgroundColor: '#E21221', // Couleur typique Netflix/Streaming
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 30,
    marginBottom: 20 
  },
  playText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  description: { lineHeight: 22, opacity: 0.8 }
});