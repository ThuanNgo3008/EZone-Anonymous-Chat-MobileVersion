/**
 * @format
 */

// Phải import trước tất cả — polyfill global URL/URLSearchParams cho Hermes,
// nếu không @microsoft/signalr sẽ lỗi "Cannot assign to property 'pathname'
// which has only a getter" khi parse HUB_URL.
import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
