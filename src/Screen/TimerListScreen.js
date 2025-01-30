import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {saveTimers, loadTimers} from '../Storage/storageService';
import TimerItem from '../Component/TimerItem';

export default function TimerListScreen({navigation}) {
  const [timers, setTimers] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [globalStatuses, setGlobalStatuses] = useState({});
  const [globalTimeLefts, setGlobalTimeLefts] = useState({});

  const refreshTimers = async () => {
    setLoading(true);
    const storedTimers = await loadTimers();
    setTimers(storedTimers);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      refreshTimers();
    }, []),
  );

  const toggleCategory = category => {
    setExpandedCategories(prev => ({...prev, [category]: !prev[category]}));
  };

  const groupedTimers = timers.reduce((acc, timer) => {
    acc[timer.category] = acc[timer.category] || [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  // Handle Bulk Actions (Start, Pause, Reset) for a specific category
  const handleBulkAction = (category, action) => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category) {
        switch (action) {
          case 'Start':
            return {...timer, status: 'Running'};
          case 'Pause':
            return {...timer, status: 'Paused'};
          case 'Reset':
            return {...timer, status: 'Paused', timeLeft: timer.duration};
          default:
            return timer;
        }
      }
      return timer;
    });

    setTimers(updatedTimers);
    saveTimers(updatedTimers);

    if (action === 'Start') {
      setGlobalStatuses(prev => ({...prev, [category]: 'Running'}));
    } else if (action === 'Pause') {
      setGlobalStatuses(prev => ({...prev, [category]: 'Paused'}));

      // Clear any running intervals
      timers.forEach(timer => {
        if (timer.category === category && timer.intervalId) {
          clearInterval(timer.intervalId);
        }
      });
    } else if (action === 'Reset') {
      setGlobalStatuses(prev => ({...prev, [category]: 'Paused'}));

      setGlobalTimeLefts(prev => ({
        ...prev,
        ...groupedTimers[category].reduce((acc, timer) => {
          acc[timer.id] = timer.duration;
          return acc;
        }, {}),
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={[styles.buttonView]}
          onPress={() => navigation.navigate('AddTimer', {refreshTimers})}>
          <Text style={[styles.buttonText]}>Add Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonView]}
          onPress={() => navigation.navigate('LogHistory', {refreshTimers})}>
          <Text style={[styles.buttonText]}>LogHistory</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.listView]}>
        <Text style={[styles.listText]}>
          List by Category
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{marginTop: 20}}
        />
      ) : (
        <SectionList
          style={{
            marginTop: 20,
          }}
          sections={Object.keys(groupedTimers).map(category => ({
            title: category,
            data: expandedCategories[category] ? groupedTimers[category] : [],
          }))}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TimerItem
              timer={item}
              setTimers={setTimers}
              globalStatus={globalStatuses[item.category]}
              globalTimeLeft={globalTimeLefts[item.id]}
            />
          )}
          renderSectionHeader={({section: {title}}) => (
            <View style={{
              marginBottom:20,
            }}>
              <TouchableOpacity
                onPress={() => toggleCategory(title)}
                style={styles.headerContainer}>
                <Text style={styles.header}>{title}</Text>
              </TouchableOpacity>

              {expandedCategories[title] && (
                <View style={styles.bulkActions}>
                  <Button
                    title="Start All"
                    onPress={() => handleBulkAction(title, 'Start')}
                  />
                  <Button
                    title="Pause All"
                    onPress={() => handleBulkAction(title, 'Pause')}
                  />
                  <Button
                    title="Reset All"
                    onPress={() => handleBulkAction(title, 'Reset')}
                  />
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  headerContainer: {
    backgroundColor: '#ddd', 
    padding: 8 ,
    alignItems:'center',
    borderRadius:20
  },
  header: {fontSize: 18, fontWeight: 'bold'},
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  buttonView: {
    backgroundColor: '#007BFF', // Blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  listView:{
    alignItems:'center',marginTop:20
  },
  listText:{
    color: 'black', fontSize: 16, fontWeight: 'bold'
  }
});

// export default TimerListSc reen;
