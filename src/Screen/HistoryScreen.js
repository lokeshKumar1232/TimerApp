import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { loadHistory } from '../Storage/storageService';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistoryData = async () => {
      const historyData = await loadHistory();
      setHistory(historyData);
    };

    loadHistoryData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Timers History</Text>
      <ScrollView style={styles.historyList}>
        {history.length > 0 ? (
          history.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.completionTime}>Completed at: {item.completionTime}</Text>
            </View>
          ))
        ) : (
          <Text>No timers completed yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  historyList: { marginBottom: 20 },
  historyItem: { padding: 10, marginVertical: 5, backgroundColor: '#f1f1f1', borderRadius: 5 },
  timerName: { fontSize: 18, fontWeight: 'bold' },
  completionTime: { fontSize: 14, color: 'gray' },
});
