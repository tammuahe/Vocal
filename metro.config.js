const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

// Get the default config
const config = getDefaultConfig(__dirname);

// Add support for react-native-svg
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// Ensure .svg files are handled correctly
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg"];

// Integrate with nativewind
const nativeWindConfig = withNativeWind(config, { input: "./global.css" });

// Wrap with reanimated metro config
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);
