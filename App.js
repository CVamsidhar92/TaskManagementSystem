import React,{useEffect,useState} from 'react';
import { View, Text,Image,StyleSheet,Dimensions,FlatList,BackHandler,Alert , LogBox } from 'react-native';
import { NavigationContainer,useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Screens/Home';
import { Task } from './Screens/Task';
import { CreateTask } from './Screens/CreateTask';
import { TaskDetails } from './Screens/TaskDetails';
import { EditTask } from './Screens/EditTask';
import {User} from './Screens/User';
import {Fileview} from './Screens/Fileview'
import { Test1 } from './Screens/Test1';
import { Test2 } from './Screens/Test2';
import { useRoute } from '@react-navigation/native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfile from './Screens/EditProfile';

import { navigationRef } from './routes/route';
import TaskDetailsScreen from './Screens/TaskDetailsScreen';


import TaskAllScreen from './Screens/TaskAllScreen';
import TaskAssignedToMe from './Screens/TaskAssignedToMe';
import TaskCreatedByMe from './Screens/TaskCreatedByMe';
import NotificationCount from './Screens/NotificationCount';


export default function App({navigation}){
  LogBox.ignoreAllLogs();
  // LogBox.ignoreLogs(['Invalid prop `textStyle` of type `array` supplied to `Cell`']);
  const Stack = createNativeStackNavigator();
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  }
  
  
  function Tabnav(){
    const Tab = createMaterialTopTabNavigator();
    const route = useRoute();
    const ref = route.params.ref;
    const id = route.params.id;
    return (
       
            <Tab.Navigator>
                <Tab.Screen name="All Tasks" component={TaskAllScreen}  initialParams={{ ref, id }} />
                <Tab.Screen name="Created By Me" component={TaskCreatedByMe} initialParams={{ ref, id }} />
                <Tab.Screen name="Assigned To Me" component={TaskAssignedToMe} initialParams={{ ref, id }} />
            </Tab.Navigator>
       
    );
  }


  return(
<NavigationContainer ref={navigationRef} independent={true}>
      <Stack.Navigator  initialRouteName="Home">
         <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
         <Stack.Screen name="Tabnav" component={Tabnav} options={{title:'Task Details',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },}}/>
        <Stack.Screen name="Task" component={Task} options={{headerShown:false}}/>
        <Stack.Screen name="CreateTask" component={CreateTask} options={{title:'Create Task',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },}}/>
         <Stack.Screen name="NotificationCount" component={NotificationCount} options={{title:'Notifications',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },}}/>
        <Stack.Screen name="User" component={User} options={{title:'Create User',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        }, headerTintColor: 'white'}} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} options={{title:'Task Details',headerStyle: {
            backgroundColor: '#0071b3',
           
         }, headerTitleStyle:{
          color:'white',
          fontSize:18
        }, headerTintColor: 'white'}}/>
        <Stack.Screen name="EditTask" component={EditTask} options={{title:'Edit Task',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },headerTintColor: 'white'}}/>
        <Stack.Screen name="Fileview" component={Fileview} options={{title:'File Viewer',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },headerTintColor: 'white'}}/>


        <Stack.Screen name="Test1" component={Test1} options={{headerShown:false}}/>
        <Stack.Screen name="Test2" component={Test2} options={{headerShown:true,title:'Tasks List',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },headerTintColor: 'white'}}/>

<Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} options={{headerShown:true,title:'Task Details',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },headerTintColor: 'white'}}/>
      

<Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:true,title:'Edit Profile',headerStyle: {
            backgroundColor: '#0071b3',
         },headerTitleStyle:{
          color:'white',
          fontSize:18
        },headerTintColor: 'white'}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
 
// }
// function Splash({navigation}){
// setTimeout(async()=>{
//   const check=await AsyncStorage.getItem('role');
//   if(check !==null){
//     if(check==="user"){
//       navigation.navigate('UserHome');
//       }else if(check=="member"){
//        navigation.navigate('UserHome');
//       }else if(check=="ver"){
//        navigation.navigate('AdminHome');
//       }else if(check==="app"){
//        navigation.navigate('AppHome');
//      }
//   }else{
//     navigation.replace('Home');
//   }
  
// },5000);

// return (
//   <View>
//     {/* <Image source={require('./images/splash.png')} style={{marginLeft:'30%',marginTop:'50%'}}/> */}
//     <Text style={{fontSize:20,color:'blue',textAlign: 'center',fontWeight:'bold',marginTop:15}}>Vijawawada Division</Text>
//     <Text style={{fontSize:18,color:'blue',textAlign: 'center',fontWeight:'bold'}}>RailClub</Text>
//   </View>
  
// );
}

