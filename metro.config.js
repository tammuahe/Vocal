const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Lấy cấu hình mặc định
const config = getDefaultConfig(__dirname);

// Thêm hỗ trợ cho react-native-svg
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// Đảm bảo các tệp .svg được xử lý đúng
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg"];

// Tích hợp với nativewind
module.exports = withNativeWind(config, { input: "./global.css" });
