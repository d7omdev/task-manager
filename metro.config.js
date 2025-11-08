// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for tslib module resolution
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Force tslib to resolve to CommonJS version
    if (moduleName === 'tslib' || moduleName.startsWith('tslib/')) {
      return {
        filePath: path.resolve(__dirname, 'node_modules/tslib/tslib.js'),
        type: 'sourceFile',
      };
    }
    
    // Default resolution
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
