import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMERS_KEY = 'timers';
const HISTORY_KEY = 'history';

// Save the timers
export const saveTimers = async (timers) => {
  await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
};

// Load timers
export const loadTimers = async () => {
  const timers = await AsyncStorage.getItem(TIMERS_KEY);
  return timers ? JSON.parse(timers) : [];
};

// Save history (completed timers log)
export const saveHistory = async (history) => {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

// Load history
export const loadHistory = async () => {
  const history = await AsyncStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};
