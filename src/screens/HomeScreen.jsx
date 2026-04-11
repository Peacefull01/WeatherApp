import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import SearchBar from '../component/SearchBar';
import WeatherCard from '../component/WeatherCard';
import {useNavigation} from '@react-navigation/native';
import {useWeather} from '../context/WeatherContext';
import LinearGradient from 'react-native-linear-gradient';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {current: weather, loading, error, searchCity} = useWeather();

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.background}
      blurRadius={8}>
      <View style={styles.overlay}>

        {/*  Search */}

        {/*  Loader */}
        {loading && (
            <ActivityIndicator
            size="large"
            color="#fff"
            style={{marginTop: 20}}
            />
        )}

        {/*  Error */}
        {error && (
            <Text style={styles.errorText}>
            {error.message || 'Something went wrong'}
          </Text>
        )}

        {/*  Weather Card */}
        {weather && (
            <View style={styles.cardContainer}>
              <SearchBar onSearch={searchCity} />
            <WeatherCard data={weather} />

            {/*  Button */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Forecast', {city: weather.name})
              }
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#cbe9eea6', '#66ebe059']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}>
                <Text style={styles.buttonText}>View 5-Day Forecast</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: 'rgba(0,0,0,0.6)', // darker for premium look
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(20,20,20,0.7)', // glass effect
    borderRadius: 20,
    padding: 10,
  },

  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  errorText: {
    color: '#ff6b6b',
    marginTop: 15,
    textAlign: 'center',
  },
});
