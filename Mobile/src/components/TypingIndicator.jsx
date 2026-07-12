import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { radius } from '../constants/theme';

const DOT_DELAYS = [0, 150, 300];

const TypingIndicator = ({ isTyping }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const dotAnims = useRef(DOT_DELAYS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!isTyping) {
      return undefined;
    }

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const loops = dotAnims.map((anim, i) => {
      anim.setValue(0);
      return Animated.loop(
        Animated.sequence([
          Animated.delay(DOT_DELAYS[i]),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      );
    });
    loops.forEach(loop => loop.start());

    return () => loops.forEach(loop => loop.stop());
  }, [isTyping, opacity, scale, dotAnims]);

  if (!isTyping) {
    return null;
  }

  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ scale }] }]}>
      <View style={styles.bubble}>
        <Text style={styles.label}>Typing...</Text>
        <View style={styles.dots}>
          {dotAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -6],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '75%',
    backgroundColor: '#FFE5EB',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
});

export default TypingIndicator;