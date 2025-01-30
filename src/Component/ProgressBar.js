import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${Math.max(0, Math.min(100, progress))}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
});

export default ProgressBar;
