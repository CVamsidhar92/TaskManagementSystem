import { ScrollView, StatusBar } from "react-native";
import React, { useState , useEffect} from "react";
import { useIsFocused, useRoute } from '@react-navigation/native';
import { BaseUrl } from "./BaseUrl";
import Icon from 'react-native-vector-icons/FontAwesome';

import Spinner from 'react-native-loading-spinner-overlay';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Modal ,
  Alert,
  BackHandler,
  Linking,
  AppState 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";


// Table to render data 



export function Test1({navigation}) {
  const route = useRoute();
  const [latestVersion, setLatestVersion] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [forceUpdateAlertShown, setForceUpdateAlertShown] = useState(false);
  // const [myversion,setmyversion] = useState('1.2');
  const [loading, setLoading] = useState(false);
  // const never forget to change this while releasing app , increment 1 every tiime 
  var myversion = '3.2';
  const [count,setcount] = useState(0);
  

  const [aState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('Next AppState is: ', nextAppState);
        handlecount();
        setAppState(nextAppState);
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  useEffect(() => {
    const getupdates = async () => {

      try {
        console.log(' i am called ') ;
       
        var data = {name:myversion};
  
        const response = await fetch(BaseUrl+'appversion', {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result1 = await response.json();
        console.log(result1[0]['appversion']); 
        if (myversion !== result1[0]['appversion']) {
          // Check if force update alert has been shown before
          AsyncStorage.getItem('forceUpdateAlertShown', (error, result) => {
            console.log(result);
            if (result !== 'true') {
              // Show force update alert
              console.log('i m insede of alert')
              Alert.alert(
                'Please Update',
                `You must update the app to the latest version to continue using. Latest version is ${result1[0]['appversion']} and your verison is ${myversion}`,
                [
                  {
                    text: 'Update',
                    onPress: () => {
                      
                      Linking.openURL(result1[0]['upatelink']);
                      // Exit app
                      BackHandler.exitApp();
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          });
        }
        else
        {
          AsyncStorage.setItem('forceUpdateAlertShown', 'false');
        }

      } catch (error) {
        console.error("Error"+error);
        // alert("something went wrong");
      }

    }

    getupdates();
  }, [appVersion]);

  // Set app version state when component mounts
  useEffect(() => {
    navigation.addListener('focus',()=>{
      setAppVersion(myversion);
    })
    // setAppVersion(myversion); // Replace with code to get app version from package.json or other source
  },[]);

 // const { name } = route.params.name;
//  const idd = route.params.id;
  
  // console.log(route.params);
  // const { setIsLoggedIn } = route.params; 
  // state for storing table data 
  const [myname,setmyname] = useState('');
  const [myid,setmyid] = useState('');
  const [search,setsearch] = useState('');
  const [active,setcnt] = useState(0);
  const [comp,setcomp] = useState(0);
  const [overd,setoverd] = useState(0);
  
  //  states for filter modal 
  const [visible, setVisible] = useState(false);

  const handleFilterPress = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handlecount = async () =>{
    const storedNotifications = await AsyncStorage.getItem('notifications');
    var notification_count = JSON.parse(storedNotifications); 
    console.log(notification_count)  
    setcount(notification_count?notification_count.length:0);
  }

  useEffect(()=>{
    navigation.addListener('focus',async ()=>{
        setmyid(await AsyncStorage.getItem('id'));
        const idfor = await AsyncStorage.getItem('id');
        handlecount();
        // const storedNotifications = await AsyncStorage.getItem('notifications');
        // var notification_count = JSON.parse(storedNotifications); 
        // console.log(notification_count)  
        // setcount(notification_count?notification_count.length:0);
        console.log('i m printing alway'+idfor);
        getCount(idfor);
        
       
    })
  },[])
  useEffect(() => {
    const getdataoflocal = async () => {
      // check if user is logged in
      
      setmyname(await AsyncStorage.getItem('name'));
      setmyid(await AsyncStorage.getItem('id'));
      
      
    }
    getdataoflocal();
  });
  
  const getCount = async (idfor) =>
  {
    const jsondata = {name:'name',id:idfor};
    setLoading(true);
    try {
      const response = await fetch(BaseUrl+'getcnt', {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      });
  
      const result = await response.json();
      // setTimeout(() => {
        setLoading(false);
        // Handle API response
        // ...
      // }, 1);
      console.log("Success:", result);
      //console.log(result.length);
      setcnt(result[0]['active']?result[0]['active']:0);
      // activecnt = ;
      setcomp(result[0]['completed']?result[0]['completed']:0)
      setoverd(result[0]['overdue']?result[0]['overdue']:0);

    } catch (error) {
      console.error("Error:", error);
    }
  }
  
const getactive = async () => {
    if(active==0)
    {
        alert('No Data Available')
    }
    else{
        navigation.navigate('Tabnav',{ref:'Active',id:myid});
    }
    
}

  const getcompleted = async () => {
    if(comp==0)
    {
        alert('No Data Available')
    }
    else{
    navigation.navigate('Tabnav',{ref:'Completed',id:myid});
    }
  }

  const getoverdue = async () => {
    if(overd==0)
    {
        alert('No Data Available')
    }
    else{
        navigation.navigate('Tabnav',{ref:'Over Due',id:myid});
    }
    
    
  }

  

 

  // loggout button 
  const handleLogout = () => {
    // Code to log out and navigate back to login screen
    // setIsLoggedIn(false);
    Alert.alert("Are you sure!", "Want to logout ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () =>
      {
        AsyncStorage.clear();
        navigation.navigate('Home');
      }
   }
    ]) 
    
  }

  const handleNotification = () =>{
    navigation.navigate('NotificationCount')
  }

  // migrate to create task 
  const migratetocreatetask = () => {
    // Code to log out and navigate back to login screen
    navigation.navigate('CreateTask');
    // navigation.navigate('TaskDetails');
  }

  const migratetocreateuser = () => {
    // Code to log out and navigate back to login screen
    navigation.navigate('User');
    // navigation.navigate('TaskDetails');
  }

  // keyboard dismisser
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const searchFilter= (text) => {
    if(text)
    {
      const newdata = tableData.filter((item)=>{
        const itemdata = item.respnames ? item.task_name.toLocaleUpperCase():''.toLocaleUpperCase();
        const textdata = text.toLocaleUpperCase();
        
        return itemdata.indexOf(textdata) > -1;
      })
      //console.log(newdata)
      setfilterData(newdata);
      setsearch(text)
    }
    else{
      setsearch(text)
      setfilterData(tableData)
    }
  }


    return (
      <SafeAreaView style={{flex:1}}>
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        
      <View style={{flex:1,backgroundColor:'#0071b3'}}>
      {/* <ScrollView> */}
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
{/* loggout + name */}
      <View>
      <View style={[styles.row,styles.elevation]}>
        <Text style={styles.label}>LOGGED IN AS :</Text>
        <Text style={styles.value}>{myname}</Text>
        {/* <Text  style={styles.notificationicon} onPress={handleNotification}><Icon name="bell" size={25} color="#002e52"  />{count}</Text> */}
        <Text  style={styles.logouticon} onPress={handleLogout}><Icon name="sign-out" size={30} color="#002e52"  /></Text>
      </View>
    </View>

    
    
    
    <View style={{flex:1,justifyContent:"center",paddingBottom:90}}>
    <View style={{flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    }}>

    <TouchableOpacity onPress={getactive} >
      <View style={styles1.active} >
        <Text style={styles1.title}>Active</Text>
        <Text style={styles1.subtitle}>{active}</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={getcompleted} >
      <View style={(styles1.completed)} >
        <Text style={styles1.title}>Completed</Text>
        <Text style={styles1.subtitle}>{comp}</Text>
      </View>
    </TouchableOpacity>
    </View>

    <View style={{flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5}}>
      <TouchableOpacity onPress={getoverdue} >
      <View style={styles1.overdue} >
        <Text style={styles1.title}>Over Due</Text>
        <Text style={styles1.subtitle}>{overd}</Text>
      </View>
    </TouchableOpacity>
    
    
    <TouchableOpacity onPress={migratetocreatetask} >
      <View style={styles1.card} >
        <Text style={styles1.title}>Create Task</Text>
      </View>
    </TouchableOpacity>
    
    
   

    </View>
    <View style={{flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5}}>

        {/* <TouchableOpacity  onPress={migratetocreateuser} >
            <View style={styles1.card1} >
        <Text style={styles1.title}>Create User</Text>
      </View>
    </TouchableOpacity> */}
    <TouchableOpacity  onPress={()=>{
        navigation.navigate('EditProfile',{id:myid})
    }} >
      <View style={styles1.card1} >
        <Text style={styles1.title}>Edit Profile</Text>
      </View>
    </TouchableOpacity>
        
    </View>

    </View>
    
    
    
    
    
    {/* </ScrollView> */}
    </View>
    
    </TouchableWithoutFeedback>
    </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    padding: 5,
  },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  tableCell: {
    padding: 4,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color:'black'
  },
  row: {
    backgroundColor: '#fffff0',
    borderRadius: 4,
    flexDirection: 'row',
    margin:10,
    alignItems: 'center',
    padding: 5,  
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    color:'#032753'
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
    color:'#032753'
  },
  logouticon:{
    fontSize : 20,
    padding:5,
    fontWeight: 'bold',
  },
  notificationicon:{
    fontSize : 20,
    padding:5,
    color:'#032753',
    fontWeight: 'normal',
  },
  makeflex:{
    flex:1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'skyblue',
    color:'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'black'
  },
});



const styles1 = StyleSheet.create({
  card: {
    width: 160,
    height: 180,
   
    marginRight:50,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e68c',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completed: {
    width: 160,
    height: 180,
    
    marginRight:60,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20b2aa',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    width: 160,
    height: 180,
    margin:20,
    // marginRight:0,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#add8e6',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overdue: {
    width: 160,
    height: 180,
    margin:20,
    // marginRight:20,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f08080',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card1 : {
    
    margin:20,
    width: 350,
    height: 90,
    
    marginTop:0,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff0',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card2 : {

    width: 160,
    height: 90,
    margin:10,
    marginRight:50,
    marginTop:0,
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff0',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  subtitle: {
    fontSize: 16,
    color:'black'
  },
});

const styles2 = {
  container: {
    flex: 3,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f00',
    padding: 5,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 5,
  },
};