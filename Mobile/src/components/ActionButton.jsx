import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { colors, disabledColors, radius } from '../constants/theme';

const VARIANT_KEYS = {
  primary: { bg: 'primary', fg: 'primaryForeground' },
  danger: { bg: 'destructive', fg: 'destructiveForeground' },
  secondary: { bg: 'secondary', fg: 'secondaryForeground' },
};

const ActionButton = ({ icon, label, onPress, disabled = false, variant = 'primary' }) => {
  const theme = colors[useColorScheme() === 'dark' ? 'dark' : 'light'];
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = value => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const { bg, fg } = VARIANT_KEYS[variant] ?? VARIANT_KEYS.primary;
  const backgroundColor = disabled ? disabledColors.background : theme[bg];
  const textColor = disabled ? disabledColors.foreground : theme[fg];

  return (
    <Animated.View style={[styles.shadowWrapper, { transform: [{ scale }] }]}>
      <View style={[styles.shadowLayer, { backgroundColor: theme.border }]} />
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.95)}
        onPressOut={() => !disabled && animateTo(1)}
        style={[styles.button, { backgroundColor, borderColor: theme.border }]}
      >
        {typeof icon === 'string' ? (
          <Text style={styles.iconText}>{icon}</Text>
        ) : icon ? (
          <View style={styles.iconWrapper}>{icon}</View>
        ) : null}
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  shadowLayer: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    borderRadius: radius,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius,
    borderWidth: 2,
  },
  iconText: {
    fontSize: 16,
  },
  iconWrapper: {
    width: 16,
    height: 16,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
  },
});

export default ActionButton;