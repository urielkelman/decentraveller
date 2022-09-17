module.exports = function(api) {
  api.cache(true);
  return {
    plugins: ['@babel/plugin-proposal-numeric-separator'],
    presets: ["babel-preset-expo"],
  };
};
