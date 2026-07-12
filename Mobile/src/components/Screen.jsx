import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export default function Screen({ children, scroll = true, style }) {
  const content = <View style={[styles.inner, style]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    padding: 20,
  },
});
