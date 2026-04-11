import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/constants';

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Search Icon */}
      <Icon name="search" size={20} color="#aaa" style={styles.leftIcon} />

      {/* Input */}
      <TextInput
        placeholder="Search city..."
        placeholderTextColor="#aaa"
        value={city}
        onChangeText={setCity}
        onSubmitEditing={handleSearch}
        style={styles.input}
      />

      {/* Arrow Button */}
      <TouchableOpacity onPress={handleSearch} style={styles.rightIcon}>
        <Icon name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15, 
    height: 50, 
  },

  leftIcon: {
    marginRight: 10, 
  },

  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },

  rightIcon: {
    marginLeft: 10, 
    padding: 8,
    borderRadius: 20,
  },
});