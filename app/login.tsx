import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const savedEmail = await AsyncStorage.getItem("userEmail");
    const savedPassword = await AsyncStorage.getItem("userPassword");

    if (email === savedEmail && password === savedPassword) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      router.replace("/(tabs)");
    } else {
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion Ninja+</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/create-account" as any)}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080611",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#8A2BFF",
    backgroundColor: "rgba(80,25,160,0.5)",
    color: "white",
    padding: 14,
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#7B22FF",
    padding: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
