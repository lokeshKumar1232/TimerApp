import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { saveTimers, loadTimers } from '../Storage/storageService';

export default function AddTimerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const handleSave = async () => {
    if (!name || !category || !duration) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true); // Start loader

    const newTimer = { 
      id: Date.now(), 
      name, 
      category, 
      duration: parseInt(duration), 
      timeLeft: parseInt(duration), 
      status: 'Paused' 
    };

    const timers = await loadTimers();
    await saveTimers([...timers, newTimer]);

    setTimeout(() => {
      setLoading(false); // Stop loader after saving
      navigation.goBack();
    }, 1000); // Add delay for smooth UI feedback
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter timer name" />
      
      <Text style={styles.label}>Category:</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Enter category" />
      
      <Text style={styles.label}>Duration (seconds):</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="Enter duration" />
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Save Timer" onPress={handleSave} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5, borderColor: '#ccc' },
});
