import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {getForecast} from '../services/weatherApi';
import ForecastCard from '../component/ForecastCard';
import SearchBar from '../component/SearchBar';

export default function ForecastScreen({route}) {
  const {city: initialCity} = route.params;

  const [city, setCity] = useState(initialCity);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetchForecast(city);
  }, [city]);

  const fetchForecast = async (cityName) => {
    try {
      setLoading(true);
      const data = await getForecast(cityName);
      setForecast(data.list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')} // ✅ same background
      style={styles.background}
      blurRadius={8}>
      
      <View style={styles.overlay}>

        {/* 🔍 Search Bar */}
        <SearchBar onSearch={(val) => setCity(val)} />

        {/* 📍 Title */}
        <Text style={styles.title}>{city} - 5 Day Forecast</Text>

        {/* ⏳ Loader */}
        {loading && (
          <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
        )}

        {/* 📅 Forecast List */}
        <FlatList
          data={forecast}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          renderItem={({item}) => (
            <View style={styles.cardWrapper}>
              <ForecastCard item={item} />
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // same as HomeScreen
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },

  cardWrapper: {
    backgroundColor: 'rgba(255,255,255,0.08)', // glass effect
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
});