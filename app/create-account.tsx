import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateAccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const createAccount = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Remplis tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Erreur", "Tu dois accepter les conditions.");
      return;
    }

    await AsyncStorage.setItem("userEmail", email);
    await AsyncStorage.setItem("userPassword", password);
    await AsyncStorage.setItem("isLoggedIn", "true");

    router.replace("/(tabs)");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={38} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Créer{"\n"}un compte</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: exemple@mail.com"
          placeholderTextColor="#ddd"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.inputIcon}>
          <TextInput
            style={styles.passwordInput}
            placeholder="ex: Exemple2006"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons name="eye-outline" size={24} color="white" />
        </View>

        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <View style={styles.inputIcon}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry
            placeholderTextColor="#ddd"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Ionicons name="eye-outline" size={24} color="white" />
        </View>

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.8}
        >
          <View
            style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
          >
            {acceptedTerms && (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </View>

          <Text style={styles.termsText}>
            J’accepte les conditions et la politique de confidentialité
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={createAccount}>
          <Text style={styles.buttonText}>Créer le compte</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#160033",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(35, 0, 80, 0.65)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
  },
  title: {
    color: "white",
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 25,
    textAlign: "center",
    width: "100%",
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    width: "100%",
    maxWidth: 350,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#A02BFF",
    backgroundColor: "rgba(80, 25, 160, 0.65)",
    color: "white",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    width: "100%",
    maxWidth: 350,
    borderRadius: 6,
  },
  inputIcon: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#A02BFF",
    backgroundColor: "rgba(80, 25, 160, 0.65)",
    paddingHorizontal: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    borderRadius: 6,
  },
  passwordInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 28,
    width: "100%",
    maxWidth: 350,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderColor: "white",
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: "#7B22FF",
    borderColor: "#7B22FF",
  },
  termsText: {
    color: "white",
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#7B22FF",
    paddingVertical: 14,
    width: "100%",
    maxWidth: 350,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
