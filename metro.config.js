const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Hermes optimization settings
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true, // Prevent mangling that could cause issues
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
    output: {
      ascii_only: true, // Prevent Unicode issues
      quote_style: 3,
      wrap_iife: true,
    },
    sourceMap: {
      includeSources: false, // Reduce memory usage
    },
    compress: {
      // Reduce complexity for better Hermes performance
      collapse_vars: false,
      reduce_funcs: false,
    },
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true, // Better for memory
    },
  }),
};

module.exports = config;
