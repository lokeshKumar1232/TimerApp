import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { saveTimers, loadTimers, saveHistory, loadHistory } from '../Storage/storageService';

export default function TimerItem({ timer, setTimers, globalStatus, globalTimeLeft }) {
  const [timeLeft, setTimeLeft] = useState(timer.timeLeft);
  const [status, setStatus] = useState(timer.status);
  const [intervalId, setIntervalId] = useState(null);
  const [halfwayAlertTriggered, setHalfwayAlertTriggered] = useState(false);

  // Listen for global status/time changes
  useEffect(() => {
    if (globalStatus) {
      setStatus(globalStatus);
    }
    if (globalTimeLeft !== undefined) {
      setTimeLeft(globalTimeLeft);
    }
  }, [globalStatus, globalTimeLeft]);

  useEffect(() => {
    if (status === 'Running') {
      const halfwayTime = timer.duration / 2;
      
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (!halfwayAlertTriggered && prevTime === halfwayTime) {
            triggerHalfwayAlert();
          }

          if (prevTime <= 1) {
            clearInterval(id);
            setStatus('Completed');
            updateTimerInStorage(0, 'Completed');
            logCompletedTimer();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [status, halfwayAlertTriggered]);

  const triggerHalfwayAlert = () => {
    setHalfwayAlertTriggered(true);
    Alert.alert("Halfway Alert", `You've reached 50% of the timer for ${timer.name}.`);
  };

  const updateTimerInStorage = async (newTime, newStatus) => {
    const timers = await loadTimers();
    const updatedTimers = timers.map((t) =>
      t.id === timer.id ? { ...t, timeLeft: newTime, status: newStatus } : t
    );
    await saveTimers(updatedTimers);
    setTimers(updatedTimers);
  };

  const logCompletedTimer = async () => {
    const history = await loadHistory();
    const completionTime = new Date().toLocaleString();
    const newHistory = [...history, { name: timer.name, completionTime }];
    await saveHistory(newHistory);
  };

  const startTimer = () => {
    setStatus('Running');
    updateTimerInStorage(timeLeft, 'Running');
  };

  const pauseTimer = () => {
    clearInterval(intervalId);
    setStatus('Paused');
    updateTimerInStorage(timeLeft, 'Paused');
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setTimeLeft(timer.duration);
    setStatus('Paused');
    updateTimerInStorage(timer.duration, 'Paused');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{timer.name}</Text>
      <Text style={styles.timeLeft}>Remaining Time: {timeLeft}s</Text>
      <Text style={styles.status}>Status: {status}</Text>

      <View style={styles.buttons}>
        <Button title="Start" onPress={startTimer} disabled={status === 'Running'} />
        <Button title="Pause" onPress={pauseTimer} disabled={status !== 'Running'} />
        <Button title="Reset" onPress={resetTimer} />
      </View>
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
  name: { fontSize: 18, fontWeight: 'bold' },
  timeLeft: { fontSize: 16, marginVertical: 5 },
  status: { fontSize: 14, color: 'gray' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
