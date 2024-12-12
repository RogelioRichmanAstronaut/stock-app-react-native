import '@testing-library/jest-native/extend-expect';

// Mock React Native components and modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios || obj.default),
  },
  StyleSheet: {
    create: styles => styles,
    hairlineWidth: 1,
    flatten: jest.fn(),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  },
  PixelRatio: {
    get: jest.fn().mockReturnValue(1),
    getFontScale: jest.fn().mockReturnValue(1),
    getPixelSizeForLayoutSize: jest.fn(size => size),
    roundToNearestPixel: jest.fn(size => size),
  },
  Text: 'Text',
  View: 'View',
  ScrollView: 'ScrollView',
  TouchableOpacity: 'TouchableOpacity',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  ActivityIndicator: 'ActivityIndicator',
  Animated: {
    View: 'Animated.View',
    createAnimatedComponent: jest.fn(component => component),
    timing: jest.fn(),
    spring: jest.fn(),
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      interpolate: jest.fn(),
    })),
  },
  NativeModules: {
    UIManager: {
      RCTView: {},
    },
    PlatformConstants: {
      forceTouchAvailable: false,
    },
    RNGestureHandlerModule: {
      State: { BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END' },
      attachGestureHandler: jest.fn(),
      createGestureHandler: jest.fn(),
      dropGestureHandler: jest.fn(),
      updateGestureHandler: jest.fn(),
    },
  },
}));

// Add jest-native matchers
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
  manifest: {
    extra: {
      apiUrl: 'https://api.example.com',
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    createAnimatedComponent: (component) => component,
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
    View: 'View',
    Text: 'Text',
    ScrollView: 'ScrollView',
    Image: 'Image',
    call: jest.fn(),
    withSpring: jest.fn(),
    withTiming: jest.fn(),
    useAnimatedStyle: () => ({}),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    withSequence: jest.fn(),
    withDelay: jest.fn(),
    SlideInRight: jest.fn(),
    FadeIn: jest.fn(),
    FadeOut: jest.fn(),
  },
  Layout: {
    springify: jest.fn(),
    duration: jest.fn(),
  },
  createAnimatedComponent: (component) => component,
}));

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: () => null,
}));

// Mock the ThemeContext
jest.mock('./src/context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, toggleTheme: jest.fn() }),
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
}));

// Mock StyleSheet
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: (styles) => styles,
}));

// Required for react-native-reanimated
global.__reanimatedWorkletInit = jest.fn();

// Mock the native modules that might be required
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  default: {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    getValue: jest.fn(),
    setValue: jest.fn(),
    setOffset: jest.fn(),
    flattenOffset: jest.fn(),
    extractOffset: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

// Mock the native event emitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock the native modules
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  UIManager: {
    RCTView: () => {},
  },
  PlatformConstants: {
    forceTouchAvailable: false,
  },
  RNGestureHandlerModule: {
    State: {},
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
  },
}));
