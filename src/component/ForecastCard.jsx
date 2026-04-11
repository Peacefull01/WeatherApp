import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ForecastCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{item.dt_txt}</Text>
      <Text style={styles.temp}>{item.main.temp}°C</Text>
      <Text style={styles.desc}>
        {item.weather[0].description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  date: {
    color: '#fff',
  },
  temp: {
    color: '#fff',
    fontSize: 18,
  },
  desc: {
    color: '#cbd5e1',
  },
});