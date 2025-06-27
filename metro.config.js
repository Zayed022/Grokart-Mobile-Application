const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    ...defaultConfig.resolver,
    blacklistRE: exclusionList([/.*\.js\.flow$/]),
    sourceExts: defaultConfig.resolver.sourceExts.filter(ext => ext !== 'flow'),
  },
};

module.exports = mergeConfig(defaultConfig, config);
