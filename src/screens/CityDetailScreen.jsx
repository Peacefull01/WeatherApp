import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constants/constants';
import {getCurrentWeather, getForecast} from '../services/weatherApi';
import {aggregateForecastByDay} from '../utils/forecastDaily';

// Country from API code.
function countryLabel(code) {
  if (!code) return '';
  if (code === 'IN') return 'India';
  return code;
}

// Large hero icon from weather type.
function pickHeroIcon(main, size = 72, color = '#fbbf24') {
  const m = (main || '').toLowerCase();
  let name = 'partly-sunny';
  if (m === 'clear') name = 'sunny';
  else if (m.includes('rain') || m.includes('drizzle')) name = 'rainy';
  else if (m.includes('thunder')) name = 'thunderstorm';
  else if (m.includes('snow')) name = 'snow';
  else if (m.includes('mist') || m.includes('fog') || m.includes('haze'))
    name = 'cloud';
  else name = 'cloud';
  return <Icon name={name} size={size} color={color} />;
}

// Small icon for a forecast row.
function pickDayIcon(main, size = 28, color = COLORS.textPrimary) {
  const m = (main || '').toLowerCase();
  if (m === 'clear') return <Icon name="sunny" size={size} color="#fbbf24" />;
  if (m.includes('rain') || m.includes('drizzle'))
    return <Icon name="rainy" size={size} color="#60a5fa" />;
  if (m.includes('thunder'))
    return <Icon name="thunderstorm" size={size} color="#94a3b8" />;
  return <Icon name="cloud" size={size} color={color} />;
}

// Day + date labels.
function formatDayRow(date) {
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const dayLabel = sameDay
    ? 'Today'
    : date.toLocaleDateString('en-US', {weekday: 'short'});

  const dateLabel = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {dayLabel, dateLabel};
}

// City detail screen.
export default function CityDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {city: initialCity} = route.params || {};

  const [cityName, setCityName] = useState(initialCity);
  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starred, setStarred] = useState(false);

  // Fetch APIs.
  const load = useCallback(async name => {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const [cw, fc] = await Promise.all([
        getCurrentWeather(name),
        getForecast(name),
      ]);
      setCurrent(cw);
      setCityName(cw.name);
      setDaily(aggregateForecastByDay(fc.list || []));
    } catch (e) {
      setError(e);
      setCurrent(null);
      setDaily([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(initialCity);
  }, [initialCity, load]);

  const onBack = useCallback(() => navigation.goBack(), [navigation]);
  // Star is local only (not saved).
  const onToggleStar = useCallback(() => setStarred(s => !s), []);
  const onRetry = useCallback(() => {
    load(cityName || initialCity);
  }, [load, cityName, initialCity]);

  // From `current` response.
  const metrics = useMemo(() => {
    if (!current) return null;
    const w0 = current.weather?.[0];
    const main = w0?.main ?? 'Clouds';
    return {
      subLocation: countryLabel(current.sys?.country),
      main,
      temp: Math.round(current.main.temp),
      feels: Math.round(current.main.feels_like),
      hi: Math.round(current.main.temp_max),
      lo: Math.round(current.main.temp_min),
      humidity: current.main?.humidity,
      pressure: current.main?.pressure,
      windKmh: current.wind?.speed
        ? Math.round(Number(current.wind.speed) * 3.6)
        : null,
    };
  }, [current]);

  // Forecast rows.
  const forecastRows = useMemo(
    () =>
      daily.map(day => {
        const {dayLabel, dateLabel} = formatDayRow(day.date);
        return (
          <View key={day.key} style={styles.dayCard}>
            <View style={styles.dayLeft}>
              <Text style={styles.dayName}>{dayLabel}</Text>
              <Text style={styles.dayDate}>{dateLabel}</Text>
            </View>
            <View style={styles.dayMid}>{pickDayIcon(day.weatherMain)}</View>
            <Text style={styles.dayTemps}>
              {day.min}° / {day.max}°
            </Text>
          </View>
        );
      }),
    [daily],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerBtn}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={onToggleStar}
          style={styles.headerBtn}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <Icon
            name={starred ? 'star' : 'star-outline'}
            size={26}
            color={starred ? '#fbbf24' : COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.textPrimary} />
        </View>
      )}

      {/* Error */}
      {!loading && error && (
        <View style={styles.centered}>
          <Text style={styles.errTitle}>Could not load weather</Text>
          <Text style={styles.errSub}>
            {error.message || 'Check the city name and try again.'}
          </Text>
          <TouchableOpacity style={styles.retry} onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {!loading && !error && current && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.cityTitle}>{cityName}</Text>
          {!!metrics?.subLocation && (
            <Text style={styles.subLoc}>{metrics.subLocation}</Text>
          )}

          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>{pickHeroIcon(metrics.main)}</View>
            <View style={styles.heroRight}>
              <Text style={styles.heroTemp}>{metrics.temp}°C</Text>
              <Text style={styles.heroMeta}>
                Feels like{' '}
                <Text style={styles.metaStrong}>{metrics.feels}°C</Text>
                {' \u2022 '}
                H: <Text style={styles.metaStrong}>{metrics.hi}°</Text>
                {' \u2022 '}
                L: <Text style={styles.metaStrong}>{metrics.lo}°</Text>
              </Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <MCI name="water-percent" size={26} color="#38bdf8" />
              <Text style={styles.statLabel}>Humidity</Text>
              <Text style={styles.statVal}>
                {metrics.humidity != null ? `${metrics.humidity}%` : '—'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <MCI name="weather-windy" size={26} color={COLORS.textPrimary} />
              <Text style={styles.statLabel}>Wind</Text>
              <Text style={styles.statVal}>
                {metrics.windKmh != null ? `${metrics.windKmh} km/h` : '—'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <MCI name="gauge" size={26} color={COLORS.textPrimary} />
              <Text style={styles.statLabel}>Pressure</Text>
              <Text style={styles.statVal}>
                {metrics.pressure != null ? `${metrics.pressure} hPa` : '—'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>5-Day Forecast</Text>
          {daily.length === 0 && (
            <Text style={styles.noForecast}>No multi-day forecast data.</Text>
          )}
          {forecastRows}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  headerBtn: {
    padding: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errSub: {
    color: COLORS.textMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  retry: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
  },
  retryText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  cityTitle: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  subLoc: {
    marginTop: 6,
    color: COLORS.textMuted,
    fontSize: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 28,
  },
  heroIcon: {
    marginRight: 16,
  },
  heroRight: {
    flex: 1,
  },
  heroTemp: {
    color: COLORS.textPrimary,
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
  },
  heroMeta: {
    marginTop: 8,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  metaStrong: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.6)',
    marginBottom: 28,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(148,163,184,0.15)',
    marginVertical: 4,
  },
  statLabel: {
    marginTop: 8,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  statVal: {
    marginTop: 4,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.55)',
  },
  dayLeft: {
    width: 88,
  },
  dayName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  dayDate: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  dayMid: {
    flex: 1,
    alignItems: 'center',
  },
  dayTemps: {
    width: 88,
    textAlign: 'right',
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  noForecast: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
});
