import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// 🔑 Remplace ceci par ta vraie clé API TMDB
const TMDB_API_KEY = 'f3d3ad9ea60a687311952816106b86a3';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// --- COMPOSANT ACCORDÉON ---
const Accordion = ({ title, isOpen, onToggle, children }: any) => (
  <View style={styles.accordionContainer}>
    <TouchableOpacity style={styles.accordionHeader} onPress={onToggle}>
      <Text style={styles.accordionTitle}>{title}</Text>
      <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#FFFFFF" />
    </TouchableOpacity>
    {isOpen && <View style={styles.accordionContent}>{children}</View>}
  </View>
);

// --- PAGE PRINCIPALE ---
export default function MovieDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [openAccordion, setOpenAccordion] = useState<string>('Distribution et équipes');

  // États pour stocker les données de l'API
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<any>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  
  // NOUVEAUX ÉTATS pour les équipes techniques et la classification
  const [directors, setDirectors] = useState<any[]>([]);
  const [producers, setProducers] = useState<any[]>([]);
  const [writers, setWriters] = useState<any[]>([]);
  const [certification, setCertification] = useState<string>('');

  // Fonction pour formater les minutes (ex: 112 -> 1H 52MIN)
  const formatRuntime = (minutes: number) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}H ${m}MIN`.toUpperCase();
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // 1. Appel API : Détails du film
        const movieRes = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const movieData = await movieRes.json();
        
        // 2. Appel API : Films similaires
        const similarRes = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`);
        const similarData = await similarRes.json();
        
        // 3. Appel API : Casting (Crédits)
        const creditsRes = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const creditsData = await creditsRes.json();

        // 4. Appel API : Classification d'âge (Release dates)
        const releaseRes = await fetch(`${BASE_URL}/movie/${id}/release_dates?api_key=${TMDB_API_KEY}`);
        const releaseData = await releaseRes.json();

        // --- TRAITEMENT DES DONNÉES ---
        setMovie(movieData);
        setSimilarMovies(similarData.results || []);
        setCast(creditsData.cast?.slice(0, 10) || []);

        // Tri de l'équipe technique (Crew)
        const crew = creditsData.crew || [];
        setDirectors(crew.filter((member: any) => member.job === 'Director'));
        setProducers(crew.filter((member: any) => member.job === 'Producer' || member.job === 'Executive Producer'));
        setWriters(crew.filter((member: any) => member.department === 'Writing'));

        // Extraction de l'âge
        let certif = 'Non classifié';
        const frRelease = releaseData.results?.find((r: any) => r.iso_3166_1 === 'FR');
        const usRelease = releaseData.results?.find((r: any) => r.iso_3166_1 === 'US');
        
        if (frRelease && frRelease.release_dates[0]?.certification) {
          certif = frRelease.release_dates[0].certification;
        } else if (usRelease && usRelease.release_dates[0]?.certification) {
          certif = usRelease.release_dates[0].certification;
        }
        setCertification(certif || 'Tout public');

      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  // Écran de chargement le temps de recevoir l'API
  if (loading || !movie) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  // Fonction utilitaire pour afficher les listes de l'équipe
  const renderNameList = (dataArray: any[], emptyMessage: string) => {
    if (dataArray.length === 0) return <Text style={styles.accordionText}>{emptyMessage}</Text>;
    return dataArray.map((person, index) => (
      <Text key={index} style={styles.accordionText}>• {person.name}</Text>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* 1. HERO HEADER */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path || movie.backdrop_path}` }} 
            style={styles.heroImage} 
          />
          <LinearGradient
            colors={['rgba(9, 9, 15, 0)', 'rgba(9, 9, 15, 0.6)', '#09090F']}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.topNav}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.topNavRight}>
              <TouchableOpacity style={styles.navIcon}>
                <Ionicons name="tv-outline" size={24} color="#FFF" />
              </TouchableOpacity>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
                style={styles.profilePic} 
              />
            </View>
          </View>
        </View>

        {/* 2. CONTENU PRINCIPAL */}
        <View style={styles.contentContainer}>
          
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.metaDataRow}>
            <Text style={styles.metaDataText}>{formatRuntime(movie.runtime)}</Text>
            <Text style={styles.metaDataText}>{certification}</Text>
            <Text style={styles.metaDataText}>{movie.release_date?.substring(0, 4)}</Text>
            <Text style={styles.metaDataText}>4K UHD</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={28} color="#FFF" style={styles.playIcon} />
            </TouchableOpacity>
            <View style={styles.actionRight}>
              <TouchableOpacity style={styles.actionIcon}>
                <Ionicons name="add" size={28} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Ionicons name="download-outline" size={26} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.synopsis}>
            {movie.overview ? movie.overview : "Aucun synopsis disponible pour ce film."}
          </Text>

          {/* 3. SECTION CONTENU SIMILAIRE (CORRECTION ICI : Utilisation d'un ternaire au lieu d'un && ) */}
          {similarMovies.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Contenu similaire</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similarMovies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)}>
                    <Image 
                      source={{ uri: `${POSTER_BASE_URL}${item.poster_path}` }} 
                      style={styles.similarImage} 
                    />
                  </TouchableOpacity>
                )}
              />
            </>
          ) : null}

          {/* 4. ACCORDÉONS DYNAMIQUES */}
          <View style={styles.accordionsWrapper}>
            
            <Accordion 
              title="Distribution et équipes" 
              isOpen={openAccordion === 'Distribution et équipes'}
              onToggle={() => setOpenAccordion(openAccordion === 'Distribution et équipes' ? '' : 'Distribution et équipes')}
            >
              <View style={styles.castGrid}>
                {cast.map((person, index) => (
                  <View key={index} style={styles.castRow}>
                    <Text style={styles.castRole} numberOfLines={1}>{person.character}</Text>
                    <Text style={styles.castName} numberOfLines={1}>{person.name}</Text>
                  </View>
                ))}
              </View>
            </Accordion>
            
            <Accordion 
              title="Producteur" 
              isOpen={openAccordion === 'Producteur'}
              onToggle={() => setOpenAccordion(openAccordion === 'Producteur' ? '' : 'Producteur')}
            >
              {renderNameList(producers, "Aucun producteur renseigné.")}
            </Accordion>

            <Accordion 
              title="Directeur" 
              isOpen={openAccordion === 'Directeur'}
              onToggle={() => setOpenAccordion(openAccordion === 'Directeur' ? '' : 'Directeur')}
            >
              {renderNameList(directors, "Aucun réalisateur renseigné.")}
            </Accordion>

            <Accordion 
              title="Scénaristes" 
              isOpen={openAccordion === 'Scénaristes'}
              onToggle={() => setOpenAccordion(openAccordion === 'Scénaristes' ? '' : 'Scénaristes')}
            >
              {renderNameList(writers, "Aucun scénariste renseigné.")}
            </Accordion>

            <Accordion 
              title="Classification" 
              isOpen={openAccordion === 'Classification'}
              onToggle={() => setOpenAccordion(openAccordion === 'Classification' ? '' : 'Classification')}
            >
              <Text style={styles.accordionText}>
                Âge recommandé : <Text style={{fontWeight: 'bold', color: '#FFF'}}>{certification}</Text>
              </Text>
            </Accordion>

          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090F', 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    width: '100%',
    height: height * 0.65, 
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topNav: {
    position: 'absolute',
    top: 50, 
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: 15,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7F00FF', 
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -80, 
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  metaDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  metaDataText: {
    color: '#A1A1A6',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    marginLeft: 5, 
  },
  actionRight: {
    flexDirection: 'row',
    gap: 25,
  },
  actionIcon: {
    padding: 5,
  },
  synopsis: {
    color: '#EBEBF5',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 15,
    marginTop: 10,
  },
  similarImage: {
    width: width * 0.28,
    height: (width * 0.28) * 1.5, 
    borderRadius: 4,
    marginRight: 12,
  },
  accordionsWrapper: {
    marginTop: 40,
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A24',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  accordionTitle: {
    color: '#EBEBF5',
    fontSize: 16,
    fontWeight: '500',
  },
  accordionContent: {
    paddingBottom: 15,
  },
  accordionText: {
    color: '#A1A1A6',
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 22,
  },
  castGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  castRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingRight: 10,
  },
  castRole: {
    color: '#A1A1A6',
    fontSize: 12,
    flex: 1,
    marginRight: 5,
  },
  castName: {
    color: '#EBEBF5',
    fontSize: 12,
    flex: 1,
  },
});