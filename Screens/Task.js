import { ScrollView, StatusBar } from "react-native";
import React, { useState , useEffect} from "react";
import { useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';

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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Table to render data 



export function Task({navigation}) {
  const route = useRoute();
 // const { name } = route.params.name;
  // console.log(route.params);
  // const { setIsLoggedIn } = route.params; 
  // state for storing table data 
  const [myname,setmyname] = useState('');
  const [myid,setmyid] = useState('');
  const [search,setsearch] = useState('');
  const [active,setcnt] = useState(0);
  const [comp,setcomp] = useState(0);
  const [overd,setoverd] = useState(0);
  
  useEffect(()=>{
    getCount();
  },[])
  useEffect(() => {
    const getdataoflocal = async () => {
      // check if user is logged in
      
      setmyname(await AsyncStorage.getItem('name'));
      setmyid(await AsyncStorage.getItem('id'));
     
    
      
    }
    getdataoflocal();
  });
  
  const getCount = async () =>
  {
    const jsondata = {name:'name'};
    try {
      const response = await fetch("https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/getcnt", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      });
  
      const result = await response.json();
      //console.log("Success:", result);
      //console.log(result.length);
      setcnt(result[0]['active']?result[0]['active']:0);
      // activecnt = ;
      setcomp(result[0]['completed']?result[0]['completed']:0)
      setoverd(result[0]['overdue']?result[0]['overdue']:0);

    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  const [tableData, setTableData] = useState([]);
  const [filterData,setfilterData] = useState([]);
  const getactive = async () => {
    const activedata = {status:'active'};
    try {
      const response = await fetch("https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/senddata", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activedata),
      });
  
      const result = await response.json();
      //console.log("Success:", result);
      //console.log(result.length);
      setTableData(result);
      setfilterData(result);
    } catch (error) {
      console.error("Error:", error);
    }
    
  }

  const getcompleted = async () => {
    const activedata = {status:'completed'};
    try {
      const response = await fetch("https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/senddata", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activedata),
      });
  
      const result = await response.json();
      // console.log("Success:", result);
      //console.log(result.length);
      setTableData(result);
      setfilterData(result)
    } catch (error) {
      console.error("Error:", error);
    }
    
  }

  const getoverdue = async () => {
    const activedata = {status:'overdue'};
    try {
      const response = await fetch("https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/senddata", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activedata),
      });
  
      const result = await response.json();
      //console.log("Success:", result);
      //console.log(result.length);
      setTableData(result);
      setfilterData(result)
    } catch (error) {
      console.error("Error:", error);
    }
    
  }

  

  const renderTableItem = ({ item }) => (
    <TouchableOpacity onPress={()=> navigation.navigate('TaskDetails',{taskid:item.id})} >
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { flex: 1 }]}><Text>{item.id}</Text></View>
      <View style={[styles.tableCell, { flex: 2 }]}><Text>{item.createdname}</Text></View>
      <View style={[styles.tableCell, { flex: 2 }]}><Text>{item.task_name}</Text></View>
      <View style={[styles.tableCell, { flex: 3 }]}><Text>{item.description}</Text></View>
      <View style={[styles.tableCell, { flex: 2 }]}><Text>{item.deadline}</Text></View>
      <View style={[styles.tableCell, { flex: 2 }]}><Text>{item.respnames}</Text></View>
    </View>
    </TouchableOpacity>
  );

  // loggout button 
  const handleLogout = () => {
    // Code to log out and navigate back to login screen
    // setIsLoggedIn(false);
    navigation.navigate('Home');
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
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        
      <View style={{flex:1}}>
      {/* <ScrollView> */}
      <Text style={{ fontSize: 24,backgroundColor:'#032753',color:'white' ,fontWeight: 'bold', textAlign: 'center', paddingVertical: 16 }}>
        Task Management Application
      </Text>

{/* loggout + name */}
      <View>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{myname}</Text>
        <Text  style={styles.logouticon} onPress={handleLogout}><Icon name="sign-out" size={30} color="#900"  /></Text>
      </View>
    </View>

    
    
    
    <View style={{backgroundColor:'skyblue',}}>
    <View style={{flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5}}>

    <TouchableOpacity onPress={getactive} >
      <View style={styles1.card} >
        <Text style={styles1.title}>Active</Text>
        <Text style={styles1.subtitle}>{active}</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={getcompleted} >
      <View style={styles1.card} >
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
      <View style={styles1.card} >
        <Text style={styles1.title}>Over Due</Text>
        <Text style={styles1.subtitle}>{overd}</Text>
      </View>
    </TouchableOpacity>
    
    <View style={{flexDirection: 'column'}}>
    <TouchableOpacity onPress={migratetocreatetask} >
      <View style={styles1.card1} >
        <Text style={styles1.title}>Create Task</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity  onPress={migratetocreateuser} >
      <View style={styles1.card1} >
        <Text style={styles1.title}>Create User</Text>
      </View>
    </TouchableOpacity>
    </View>

    </View>
    </View>
    
    
    <View style={{margin:5,}}>
    <TextInput
        style={styles.searchBar}
        placeholder="Search by Name & Designation"
        value={search}
        onChangeText={(text) => searchFilter(text)}
      />
    </View>
    {/* </ScrollView> */}
    
    <View style={{flex:1}}>
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Id</Text>
      <Text style={styles.headerCell}>Created By</Text>
      <Text style={styles.headerCell}>Task Name</Text>
      <Text style={styles.headerCell}>Description</Text>
      <Text style={styles.headerCell}>Deadline</Text>
      <Text style={styles.headerCell}>Responsible Member</Text>
      
      
    </View>
          <FlatList
        data={filterData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTableItem}
        
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text>Select Any of Active/Completed/Overdue to view data</Text>
          </View>
        )}
      />
    </View>
    
    {/* </ScrollView> */}
    </View>
    
    </TouchableWithoutFeedback>
     
    );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    padding: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
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
    fontWeight: 'bold',
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
    width: 150,
    height: 100,
    margin:20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card1 : {

    width: 150,
    height: 50,
    marginRight:20,
    marginTop:0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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