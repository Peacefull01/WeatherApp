import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/constants';
// import CloudIcon from '../assets/icons/CrazyCloud.svg'; 

export default function WeatherCard({ data }) {
  const temp = Math.round(data.main.temp);
  const city = data.name;
  const weather = data.weather[0].description;

  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const feelsLike = Math.round(data.main.feels_like);

  return (
    <View style={styles.card}>

      {/* LEFT SIDE DATA */}
      <View style={styles.left}>
        <Text style={styles.city}>{city}</Text>

        <Text style={styles.temp}>{temp}°C</Text>

        <Text style={styles.desc}>{weather}</Text>

        {/* EXTRA INFO */}
        <View style={styles.extraRow}>
          <Text style={styles.extra}> {humidity}%</Text>
          <Text style={styles.extra}> {wind} m/s</Text>
        </View>

        <Text style={styles.feels}>
          Feels like {feelsLike}°C
        </Text>
      </View>

      {/* RIGHT SIDE ICON */}
      <View style={styles.right}>
        {/* <CloudIcon width={90} height={90} /> */}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 20,
  },

  left: {
    flex: 1,
  },

  right: {
    marginLeft: 10,
  },

  city: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },

  temp: {
    color: COLORS.textPrimary,
    fontSize: 42,
    fontWeight: 'bold',
    marginVertical: 5,
  },

  desc: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textTransform: 'capitalize',
  },

  extraRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15, // spacing between humidity & wind
  },

  extra: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  feels: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
});