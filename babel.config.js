module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Only one 'presets' key
    plugins: ['nativewind/babel'], // Includes NativeWind plugin
  };
};
