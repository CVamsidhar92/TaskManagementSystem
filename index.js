/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";

// const [notifications, setNotifications] = useState([]);

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  const storedNotifications = await AsyncStorage.getItem('notifications');
        if(storedNotifications)
        {
          const updatedNotifications = JSON.parse(storedNotifications)
          const updatedNotifications2 = [...updatedNotifications,remoteMessage];
          await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications2));
          // console.log(updatedNotifications2)
        
        }
        else{
          const updatedNotifications = [remoteMessage];
          // setNotifications(updatedNotifications)
          await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
         console.log(updatedNotifications)
        }
        // var notification =  JSON.parse(storedNotifications);
     
  
});

AppRegistry.registerComponent(appName, () => App);
