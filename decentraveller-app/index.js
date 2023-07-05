/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
require('@walletconnect/react-native-compat');
require('react-native-gesture-handler');

const { Platform } = require('react-native');

if (Platform.OS !== 'web') {
    require('./global');
}

const { registerRootComponent, scheme } = require('expo');
const { default: App } = require('./App');

const { default: AsyncStorage } = require('@react-native-async-storage/async-storage');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
