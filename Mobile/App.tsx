/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState } from 'react';
import { Alert, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatBubble from './src/components/ChatBubble';
import ActionButton from './src/components/ActionButton';
import TypingIndicator from './src/components/TypingIndicator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isTyping, setIsTyping] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>


        {/* TEST elements trong src/components/
        <ChatBubble message="Chào bạn, mình ghép cặp với bạn rồi nè!" isOwn={false} timestamp="10:30" />
        <ChatBubble message="Chào bạn nha, khoẻ không?" isOwn={true} timestamp="10:31" />

        <TypingIndicator isTyping={isTyping} />

        <ActionButton
          icon="⌨️"
          label={isTyping ? 'Stop Typing' : 'Simulate Typing'}
          variant="secondary"
          onPress={() => setIsTyping(prev => !prev)}
        />

        <View style={styles.buttonRow}>
          <ActionButton
            icon="🔒"
            label="Zone Reveal"
            variant="primary"
            disabled
            onPress={() => Alert.alert('Reveal', 'Chưa đủ điều kiện reveal')}
          />
          <ActionButton
            icon="⚠️"
            label="Zone Report"
            variant="danger"
            onPress={() => Alert.alert('Report', 'Mở report dialog')}
          />
          <ActionButton
            icon="🚪"
            label="Leave Zone"
            variant="secondary"
            onPress={() => Alert.alert('Leave', 'Rời phòng chat')}
          /> */}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
  },
});

export default App;
