
import { ScrollView, StatusBar } from "react-native";
import React, { useState ,useEffect,createRef} from "react";
import { useRoute } from '@react-navigation/native';
// import { ScrollView, StatusBar } from "react-native";
import PushNotification from "react-native-push-notification";
import { NavigationContainer,useIsFocused } from '@react-navigation/native';
import { BaseUrl } from "./BaseUrl";
import messaging from '@react-native-firebase/messaging';

import Spinner from 'react-native-loading-spinner-overlay';

import * as RootNavigation from '../routes/route'
import { CommonActions } from '@react-navigation/native';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    SafeAreaView,
    Button,
    TouchableOpacity,
    Keyboard,
    PermissionsAndroid,
    Alert,
    Platform
  } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function Home({navigation}){   
  const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const passwordInputRef = createRef();
      const isVisible = useIsFocused();
      const [grant,setgrant] = useState(false);

      const [loading, setLoading] = useState(false);
      const [notifications, setNotifications] = useState([]);

      useEffect(() => {
        // Assume a message-notification contains a "type" property in the data payload of the screen to open
        
        messaging().onNotificationOpenedApp(remoteMessage => {
          // console.log(
          //   'Notification caused app to open from background state:',
          //   remoteMessage.notification,
          // );
          const tskid = remoteMessage.data?.tskid;
          
          const ScreenName = remoteMessage.data?.ScreenName;
          if(ScreenName=='overdue'){
            navigation.replace('Tabnav',{ref:'overdue',id:tskid});
          }else{
 // console.log('Received notification with tskid:', tskid);
 navigation.replace('TaskDetails',{taskid:tskid});
          }
         
        
        });

        messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage.notification,
          // );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          const tskid = remoteMessage.data?.tskid;
          const ScreenName = remoteMessage.data?.ScreenName;
          if(ScreenName=='overdue'){
            setTimeout(()=>{
              RootNavigation.navigate('Tabnav',{ref:'overdue',id:tskid});
            },1100)
          }else{
            console.log('Received notification with tskid in quit state', tskid);
            setTimeout(()=>{
              RootNavigation.navigate('TaskDetails',{taskid:tskid});
            },1100)
          }         
         
          const updatedNotifications = [remoteMessage];
          setNotifications(updatedNotifications);
         
          try {
             AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
          } catch (error) {
            console.log('Error saving notifications:', error);
          }
          
          
        
        }
        // setLoading(false);
      });

      messaging().onMessage(remoteMessage => {
        console.log(
          `PushManager(android): onMessage: ${JSON.stringify(
            remoteMessage,
          )}`,
        );

        const ScreenName = remoteMessage.data?.ScreenName;


        Alert.alert(
          `${remoteMessage.notification.title} Task`,
          `${remoteMessage.notification.body}`,
          [
            {
              text: 'cancel',
              onPress: () => {
              
              },
            },
            {

              text:ScreenName=='overdue'?'Go to Overdue Tasks': 'Navigate to task',
              
              onPress: () => {
              
                const tskid = remoteMessage.data?.tskid;
                if(ScreenName=='overdue'){
                  navigation.replace('Tabnav',{ref:'overdue',id:tskid});
                }else{
                  console.log('i am navigation  bro')
                  navigation.replace('TaskDetails',{taskid:tskid});
                }
              },
            },
          ],
          { cancelable: true }
        );
      });

      }, []);
      useEffect(()=>{
        // navigation.addListener('focus',()=>{
          
            AsyncStorage.getItem('status').then((dres)=>{
              if(dres!==null){
              
                navigation.navigate('Test1');
              }
              else{
                // opening app first time
                takepermission();
                  //console.log('get token func')
                  gettoken();
               
              }
            });
          
        // })
        
      },[isVisible]);
      const  takepermission =  async () => {
        if (Platform.OS === 'android') {
          // Calling the permission function
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            // {
            //   title: 'Example App Camera Permission',
            //   message: 'Example App needs access to your camera',
            // },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission Granted
            setgrant(true);
          } else {
            // Permission Denied
            //alert('You wont be receiving Notifications from the APP');
          }
        } else {
         // proceed();
        }
      };
      const gettoken =()=>{
        PushNotification.configure({
          onRegister: function (token) {
           setToken(token['token']);
           //console.log(token['token']);
          
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
         popInitialNotification: true,
          requestPermissions: true,
          onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);
            const tskid = notification.data?.tskid;
            const redirect = notification.data?.redirecto;
            console.log('Received notification with tskid:', tskid);
            
            navigation.navigate('TaskDetails',{taskid:tskid});
          },
        
        });
      }
        const [token,setToken]=useState('');
      const [myid,setmyid] = useState('');
      const route = useRoute();
      // const { setIsLoggedIn } = route.params; 
      const handleLogin = async () => {
              
              if(email && password){
                setLoading(true);
                try {
                 
                  var data = {uname:email,password:password,token:token};
                  console.log(data);
                  setEmail('');
                  setPassword('');
                  const response = await fetch(BaseUrl+'login', {
                    method: "POST", 
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  });
                  // const response = await fetch("https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/login");
                  // const jsonData = await response.json();
                  // console.log(jsonData)
                  const result = await response.json();
                  setTimeout(() => {
                    setLoading(false);
                    // Handle API response
                    // ...
                  }, 2000);
                  //result = JSON.parse(result);
                  // console.log(result);
                  if(result['status']=='200')
                  {
                  //  setIsLoggedIn()
                 
                   await AsyncStorage.setItem('status',"true");
                   
                   await AsyncStorage.setItem('name',result.name);
                   await AsyncStorage.setItem('id',JSON.stringify(result.id));
                  //  navigation.navigate('Task');
                  setmyid(JSON.stringify(result.id));
                  console.log(result.id);
                  navigation.navigate('Test1');
                   await AsyncStorage.setItem('role',result.role);
                   await AsyncStorage.setItem('dept',result.dept);
                   await AsyncStorage.setItem('desg',result.desg);
                   await AsyncStorage.setItem('division',result.division);
                   await AsyncStorage.setItem('gparentid',result.gparentid);
                   await AsyncStorage.setItem('parentid',result.parentid);
                   await AsyncStorage.setItem('phno',result.phno);
                   await AsyncStorage.setItem('role',result.role);
                 
                   
                   
                   //navigation.navigate('Task');
                    
                  }
                  else{
                    alert(result['message']);
                  }
                  
                } catch (error) {
                  console.error("Error"+error);
                  alert("something went wrong");
                }
                
              }
              else{
                alert('Enter All Fields')
              }
              
            };

return(
  <SafeAreaView  style={{backgroundColor:'#0071b3',flex:1}}>

<StatusBar backgroundColor="#0071b3" />  
  <ScrollView style={{backgroundColor:'#0071b3'}} keyboardShouldPersistTaps="handled">
     <View style={styles.container}>

     <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
           {/* {/* <StatusBar style="auto" /> */}
          <Image style={styles.imageleft} source={require('../assets/rl.png')} /> 
           <Image style={styles.imageright} source={require('../assets/g20.png')} /> 
           {/* <Image style={styles.image1} source={require('../assets/tmalogo.jpeg')} ></Image> */}
           <View>
      {/* <ScrollView> */}
      
      <Text style={{ fontSize: 22,color:'white' ,fontWeight: 'bold', textAlign: 'center', marginTop:135,paddingHorizontal:20}}>
        Task Management Application
      </Text>
      <Image style={{flexDirection:'row',resizeMode:'contain',height:160,marginLeft:160,marginBottom:15,marginTop:15}}  source={require('../assets/tmalogo.png')} />
      </View>
      
          
          {/* <View style={styles.inputView}>
           <TextInput
              // style={styles.TextInput}
              // placeholder="Username"
              // placeholderTextColor="#36454F"
              // autoCapitalize="none"
              // keyboardType="defualt"
              // returnKeyType="next"
              // underlineColorAndroid="#f000"
              // onChangeText={(email) => setEmail(email)}
              style={styles.inputStyle}
              onChangeText={email => setEmail(email)}
              placeholder="Enter Username"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            /> 
          </View> 
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            /> 
          </View>  */}

          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              value={email}
              onChangeText={email => setEmail(email)}
              placeholder="Username"
              placeholderTextColor="#003f5c"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              underlineColorAndroid="#f000"              
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              onChangeText={password => setPassword(password)}
              style={styles.inputStyle}
              value={password}
              placeholder="Password" //12345
              placeholderTextColor="#003f5c"
              keyboardType="default"
              returnKeyType="done"             
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              // returnKeyType="next"
            />
          </View>
          
          <TouchableOpacity       
         style={styles.loginBtn} 
           onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text> 
          </TouchableOpacity>  
          {/* <View style={{margin:10}}>
          <TouchableOpacity>
            <Text style={styles.forgot_button}>Send OTP to Registered Mail ID</Text> 
          </TouchableOpacity>
          </View> */}
        </View> 
        </ScrollView>
        </SafeAreaView>
);
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#0071b3",
      alignItems: "center",
      justifyContent: "center",
      width:"100%",
      height:"100%",
    },
    imageleft: {
      position:"absolute",
      left:20 , top:25 , width:70,height:70,
    },
    imageright:{
      position:"absolute",
      right:20 , top:30 , width:110,height:55,
    },
    image1: {
      marginLeft:150,
      justifyContent:'center',
      alignItems:'center',
      height:200,
      width:'90%',
      resizeMode: 'contain',
    },
    inputView: {
      fontFamily:'Open Sans',
      backgroundColor: "skyblue",
      borderRadius: 5,
      marginBottom: 20,
      alignItems: "flex-start",
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 35,
      marginRight: 35,
      width:'90%'
    },
    TextInput: {
      height: 40,
      flex: 1,
      fontSize:15,
      color:'#002e52',
    },
    forgot_button: {
      color:'white',
      height: 30,
      
    },
    loginBtn: {
      width: "90%",
      height:40,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#002e52",
      marginTop:10,
    },
    loginText:{
      color:'white',
      fontSize: 20,
      fontWeight: 'bold',
    },

    

    SectionStyle: {
      flexDirection: 'row',
      backgroundColor: "skyblue",
      height: 40,
      borderRadius: 5,
      marginTop: 20,
      marginBottom: 10,
      marginLeft: 35,
      marginRight: 35,
      width:'90%',
    },
    inputStyle: {
      flex: 1,
      color: 'black',
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: 'skyblue',
      fontWeight: 'bold',
      borderWidth: 2,
      color:'#002e52',

    },
   
  });