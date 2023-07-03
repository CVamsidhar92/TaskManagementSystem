import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity ,SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationCount({navigation}) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');
        // const storedNotifications1 = await AsyncStorage.getItem('newnotifications');
        // console.log(storedNotifications1);
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      } catch (error) {
        console.log('Error loading notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  const removeNotification = async (index,item) => {
   console.log('clicked remove notificaiton')
    const updatedNotifications = [...notifications];
    // const newupdateNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    // console.log(newupdateNotifications);

    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      // await AsyncStorage.setItem('newnotifications', JSON.stringify(newupdateNotifications));
      setNotifications(updatedNotifications);
      const tskid = item.data?.tskid;
      console.log(tskid);
      navigation.navigate('TaskDetails',{taskid:tskid});
    } catch (error) {
      console.log('Error removing notification:', error);
    }
  };

  const renderNotification = ({ item, index }) => {
    return (
      
      <TouchableOpacity onPress={() => removeNotification(index,item)} style={styles.notificationCard}>
         <Text  style={{ fontSize: 15,color:'red' ,fontWeight: 'bold'}}>{item.notification.title}</Text>
        <Text styles={{color:'#032753',fontWeight: 'bold'}}>{item.notification.body}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>NO NEW NOTIFICATIONS AVAILABLE</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'#0071b3'
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
