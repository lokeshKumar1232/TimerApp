import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { saveTimers, loadTimers } from '../Storage/storageService';

export default function TimerCategories({ category = {}, setTimers }) {
  const [localCategories, setLocalCategories] = useState(category);

  // Debugging to check what categories are being passed and loaded
  useEffect(() => {
    console.log('Received Categories:', category);
    setLocalCategories(category); // Ensure we set state correctly
  }, [category]);

  const updateTimersInStorage = async (updatedCategories) => {
    await saveTimers(updatedCategories);
    setTimers(updatedCategories);
  };

  const startAllTimersInCategory = (categoryName) => {
    const updatedCategories = { ...localCategories };
    updatedCategories[categoryName] = updatedCategories[categoryName]?.map((timer) => {
      if (timer.status !== 'Running') {
        timer.status = 'Running';
        timer.timeLeft = timer.timeLeft > 0 ? timer.timeLeft : timer.duration; // reset timeLeft if it's 0
      }
      return timer;
    }) || []; // Fallback to empty array if undefined
    updateTimersInStorage(updatedCategories);
  };

  const pauseAllTimersInCategory = (categoryName) => {
    const updatedCategories = { ...localCategories };
    updatedCategories[categoryName] = updatedCategories[categoryName]?.map((timer) => {
      if (timer.status === 'Running') {
        timer.status = 'Paused';
      }
      return timer;
    }) || []; // Fallback to empty array if undefined
    updateTimersInStorage(updatedCategories);
  };

  const resetAllTimersInCategory = (categoryName) => {
    const updatedCategories = { ...localCategories };
    updatedCategories[categoryName] = updatedCategories[categoryName]?.map((timer) => {
      timer.status = 'Paused';
      timer.timeLeft = timer.duration;
      return timer;
    }) || []; // Fallback to empty array if undefined
    updateTimersInStorage(updatedCategories);
  };

  const restartAllTimersInCategory = (categoryName) => {
    const updatedCategories = { ...localCategories };
    updatedCategories[categoryName] = updatedCategories[categoryName]?.map((timer) => {
      timer.status = 'Running';
      timer.timeLeft = timer.duration;
      return timer;
    }) || []; // Fallback to empty array if undefined
    updateTimersInStorage(updatedCategories);
  };

  return (
    <View style={styles.card}>
      {Object.keys(localCategories).length > 0 ? (
        Object.keys(localCategories).map((categoryKey) => (
          <View key={categoryKey}>
            <Text style={styles.categoryName}>{categoryKey}</Text>

            {localCategories[categoryKey]?.map((timer) => (
              <View key={timer.id} style={styles.timerCard}>
                <Text style={styles.name}>{timer.name}</Text>
                <Text style={styles.timeLeft}>Remaining Time: {timer.timeLeft}s</Text>
                <Text style={styles.status}>Status: {timer.status}</Text>
              </View>
            ))}

            <View style={styles.buttons}>
              <Button title={`Start All ${categoryKey}`} onPress={() => startAllTimersInCategory(categoryKey)} />
              <Button title={`Pause All ${categoryKey}`} onPress={() => pauseAllTimersInCategory(categoryKey)} />
              <Button title={`Reset All ${categoryKey}`} onPress={() => resetAllTimersInCategory(categoryKey)} />
              <Button title={`Restart All ${categoryKey}`} onPress={() => restartAllTimersInCategory(categoryKey)} />
            </View>
          </View>
        ))
      ) : (
        <Text>No Timers Available</Text> // Fallback in case there are no categories to display
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  categoryName: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  timerCard: { marginBottom: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  timeLeft: { fontSize: 16, marginVertical: 5 },
  status: { fontSize: 14, color: 'gray' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});