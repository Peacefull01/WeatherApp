import React, {useState, useCallback, forwardRef, memo, useRef,useImperativeHandle} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../constants/constants';

// City search input.
const SearchBar = memo(
  forwardRef(function SearchBar({onSearch}, ref) {
    const [city, setCity] = useState('');

    // Submit trimmed text, clear field.
    const handleSearch = useCallback(() => {
      setCity(c => {
        const t = c.trim();
        if (t) onSearch(t);
        return t ? '' : c;
      });
    }, [onSearch]);

    return (
      <View style={styles.container}>
        <Icon
          name="search"
          size={18}
          color={COLORS.textMuted}
          style={styles.leftIcon}
        />
        <TextInput
          ref={ref}
          placeholder="Search city..."
          placeholderTextColor={COLORS.textMuted}
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          style={styles.input}
        />
      </View>
    );
  }),
);

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 28,
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
  },
});
