import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, SIZES} from '../constants/constants';

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

function pickDayIcon(main, size = 28, color = COLORS.textPrimary) {
  const m = (main || '').toLowerCase();
  if (m === 'clear') return <Icon name="sunny" size={size} color={COLORS.sunny} />;
  if (m.includes('rain') || m.includes('drizzle'))
    return <Icon name="rainy" size={size} color={COLORS.rainy} />;
  if (m.includes('thunder'))
    return <Icon name="thunderstorm" size={size} color={COLORS.thunderstorm} />;
  return <Icon name="cloud" size={size} color={color} />;
}

export default function ForecastRow({day}) {
  const {dayLabel, dateLabel} = formatDayRow(day.date);

  return (
    <View style={styles.dayCard}>
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
}

const styles = StyleSheet.create({
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: SIZES.padding,
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
});
