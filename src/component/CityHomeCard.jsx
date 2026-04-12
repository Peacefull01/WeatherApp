import React, {memo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../constants/constants';

// Icon name from weather type.
function pickWeatherIcon(main) {
  const m = (main || '').toLowerCase();
  if (m === 'clear') return 'sunny-outline';
  if (m.includes('rain') || m.includes('drizzle')) return 'rainy-outline';
  if (m.includes('thunder')) return 'thunderstorm-outline';
  if (m.includes('snow')) return 'snow-outline';
  if (m.includes('mist') || m.includes('fog') || m.includes('haze'))
    return 'cloud-outline';
  return 'cloud-outline';
}

// Country text under city name.
function countryLabel(code) {
  if (!code) return '';
  if (code === 'IN') return 'India';
  return code;
}

// Nicer weather text.
function titleCase(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Bottom skyline decoration.
function Skyline() {
  const blocks = [10, 16, 8, 20, 12, 18, 7, 14, 22, 11];
  return (
    <View style={styles.skyline} pointerEvents="none">
      {blocks.map((h, i) => (
        <View key={i} style={[styles.skyBlock, {height: h, width: 8 + (i % 4) * 2}]} />
      ))}
    </View>
  );
}

// Memo: skip render if data unchanged.
function areCityCardPropsEqual(prev, next) {
  if (prev.selected !== next.selected || prev.editing !== next.editing) {
    return false;
  }
  const a = prev.data;
  const b = next.data;
  if (a.id !== b.id) {
    return false;
  }
  if (Math.round(a.main?.temp ?? 0) !== Math.round(b.main?.temp ?? 0)) {
    return false;
  }
  const wa = a.weather?.[0];
  const wb = b.weather?.[0];
  if (wa?.icon !== wb?.icon || wa?.description !== wb?.description) {
    return false;
  }
  return true;
}

// One city on the home list.
function CityHomeCard({
  data,
  selected,
  editing,
  onSelect,
  onRemove,
  onOpenDetail,
}) {
  const temp = Math.round(data.main?.temp ?? 0);
  const city = data.name;
  const w0 = data.weather?.[0];
  const main = w0?.main ?? '';
  const desc = titleCase(w0?.description ?? '');
  const sub = countryLabel(data.sys?.country);

  return (
    <View style={[styles.wrap, selected && styles.wrapSelected]}>
      <LinearGradient
        colors={[COLORS.cardGradientStart, COLORS.cardGradientEnd]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradient}>
        <Skyline />

        {editing && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={onRemove}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="close-circle" size={22} color={COLORS.error} />
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          {/* Tap: select + open detail */}
          <TouchableOpacity
            style={styles.mainHit}
            activeOpacity={0.9}
            onPress={() => {
              onSelect();
              if (!editing && onOpenDetail) {
                onOpenDetail();
              }
            }}>
            <View style={styles.left}>
              <View style={styles.cityRow}>
                <Icon
                  name="location-outline"
                  size={16}
                  color={COLORS.textMuted}
                  style={styles.pin}
                />
                <Text style={styles.city}>{city}</Text>
              </View>
              {!!sub && <Text style={styles.sub}>{sub}</Text>}
            </View>

            <View style={styles.right}>
              <Text style={styles.temp}>{temp}°C</Text>
              <Icon
                name={pickWeatherIcon(main)}
                size={36}
                color={COLORS.textPrimary}
                style={styles.wIcon}
              />
              <Text style={styles.cond}>{desc}</Text>
            </View>
          </TouchableOpacity>

          {/* Chevron → detail */}
          {!editing && onOpenDetail && (
            <TouchableOpacity
              onPress={() => {
                onSelect();
                onOpenDetail();
              }}
              style={styles.forecastBtn}
              hitSlop={{top: 12, bottom: 12, left: 8, right: 8}}>
              <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

// Exported with memo().
export default memo(CityHomeCard, areCityCardPropsEqual);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  wrapSelected: {
    borderColor: COLORS.borderSelected,
  },
  gradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 8,
    minHeight: 112,
    overflow: 'hidden',
  },
  skyline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    opacity: 0.22,
  },
  skyBlock: {
    backgroundColor: '#020617',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainHit: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: 8,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pin: {
    marginRight: 4,
  },
  city: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    marginTop: 4,
    marginLeft: 20,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 88,
    paddingRight: 4,
  },
  temp: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  wIcon: {
    marginTop: 4,
  },
  cond: {
    marginTop: 2,
    color: COLORS.textPrimary,
    fontSize: 12,
    opacity: 0.9,
  },
  forecastBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
});
