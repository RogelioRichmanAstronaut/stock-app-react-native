import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export function ThemeSelector() {
  const { theme, setTheme, isDark } = useTheme();

  const options = [
    { value: 'light' as const, label: '☀️ Light' },
    { value: 'dark' as const, label: '🌙 Dark' },
    { value: 'system' as const, label: '⚙️ System' },
  ];

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
    ]}>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: theme === option.value
                  ? (isDark ? '#2C2C2E' : '#F2F2F7')
                  : 'transparent'
              }
            ]}
            onPress={() => setTheme(option.value)}
          >
            <Animated.Text style={[
              styles.optionText,
              {
                color: isDark ? '#FFFFFF' : '#000000',
                opacity: theme === option.value ? 1 : 0.6
              }
            ]}>
              {option.label}
            </Animated.Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
