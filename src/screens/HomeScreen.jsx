import React, {useRef, useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../component/SearchBar';
import CityHomeCard from '../component/CityHomeCard';
import {useWeather} from '../context/WeatherContext';
import {COLORS, SIZES} from '../constants/constants';

// City list + search home.
export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const [editing, setEditing] = useState(false);

  const {
    savedCities,
    selectedId,
    loading,
    error,
    searchCity,
    selectCity,
    removeCity,
  } = useWeather();

  // Scroll up and focus search.
  const goAddCity = useCallback(() => {
    Keyboard.dismiss();
    listRef.current?.scrollToOffset({offset: 0, animated: true});
    setTimeout(() => searchRef.current?.focus(), 250);
  }, []);

  // Toggle edit mode.
  const toggleEdit = useCallback(() => {
    setEditing(v => !v);
  }, []);

  // One city card.
  const renderItem = useCallback(
    ({item}) => (
      <CityHomeCard
        data={item}
        selected={item.id === selectedId}
        editing={editing}
        onSelect={() => selectCity(item.id)}
        onRemove={() => removeCity(item.id)}
        onOpenDetail={() =>
          navigation.navigate('CityDetail', {city: item.name})
        }
      />
    ),
    [editing, navigation, removeCity, selectCity, selectedId],
  );

  // List header.
  const ListHeader = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <SearchBar ref={searchRef} onSearch={searchCity} />
        {!!error && (
          <Text style={styles.errorText}>
            {error.message || 'Something went wrong'}
          </Text>
        )}
        <Text style={styles.sectionTitle}>My Cities</Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color={COLORS.textPrimary}
            style={styles.loader}
          />
        )}
      </View>
    ),
    [loading, error, searchCity],
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.empty}>
        <Icon name="earth-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>No cities yet</Text>
        <Text style={styles.emptySub}>
          Search above to add a city, or use Add City below.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.root}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <Icon name="partly-sunny" size={26} color={COLORS.sunny} />
            <Text style={styles.brandText}>Weather</Text>
          </View>
          <TouchableOpacity
            onPress={toggleEdit}
            style={styles.iconBtn}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon
              name={editing ? 'checkmark' : 'pencil'}
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* List perf */}
        <FlatList
          ref={listRef}
          data={savedCities}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraData={{selectedId, editing}}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
        />

        {/* Safe bottom */}
        <View style={[styles.footer, {bottom: 12 + insets.bottom}]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={goAddCity}
            style={styles.addOuter}>
            <LinearGradient
              colors={[COLORS.gradientBlue, COLORS.gradientViolet]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.addBtn}>
              <Text style={styles.addLabel}>+ Add City</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 4,
  },
  headerBlock: {
    paddingBottom: 8,
  },
  loader: {
    marginTop: 8,
    alignSelf: 'center',
  },
  errorText: {
    color: COLORS.error,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SIZES.padding,
  },
  emptyTitle: {
    marginTop: 12,
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  emptySub: {
    marginTop: 8,
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: SIZES.padding,
  },
  addOuter: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  addBtn: {
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  addLabel: {
    color: COLORS.textPrimary,
    fontSize: SIZES.fontSize,
    fontWeight: '600',
  },
});
