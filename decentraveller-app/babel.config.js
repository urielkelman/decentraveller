module.exports = function (api) {
    api.cache(true);
    return {
        plugins: ['@babel/plugin-proposal-numeric-separator', 'react-native-reanimated/plugin'],
        presets: ['babel-preset-expo'],
    };
};
