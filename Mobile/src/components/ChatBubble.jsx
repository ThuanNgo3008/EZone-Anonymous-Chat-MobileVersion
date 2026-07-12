import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { colors, radius } from '../constants/theme';

const ChatBubble = ({ message, isOwn, timestamp }) => {
  const theme = colors[useColorScheme() === 'dark' ? 'dark' : 'light'];

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const bubbleBackground = isOwn ? theme.primary : theme.muted;
  const textColor = isOwn ? theme.primaryForeground : theme.foreground;
  const timestampColor = isOwn ? 'rgba(255,255,255,0.7)' : theme.mutedForeground;

  return (
    <Animated.View
      style={[
        styles.row,
        {
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.shadowWrapper}>
        <View style={[styles.shadowLayer, { backgroundColor: theme.border }]} />
        <View
          style={[
            styles.bubble,
            { backgroundColor: bubbleBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          {timestamp ? (
            <Text style={[styles.timestamp, { color: timestampColor }]}>
              {timestamp}
            </Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  shadowWrapper: {
    maxWidth: '75%',
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    borderRadius: radius,
  },
  bubble: {
    borderWidth: 2,
    borderRadius: radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default ChatBubble;