import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#8E8E93" />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#8E8E93"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  searchBar: {
    height: 48,
    backgroundColor: '#15161A',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    marginLeft: 10,
    fontSize: 15,
  },
});