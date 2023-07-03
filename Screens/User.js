import React, { useState ,useEffect } from 'react';
import { View, Text, TextInput, Button , StyleSheet , ScrollView ,TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Picker} from '@react-native-picker/picker';
import { BaseUrl } from './BaseUrl';

export function User({navigation})  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Gmo@123');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [division, setDivision] = useState('');
  const [divisions,setDivisions] = useState([]);
  const [parentId, setParentId] = useState('');
  const [grandparentId, setGrandparentId] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [myname,setmyname] = useState('');
  const [myid,setmyid] = useState('');
  const [gpid,setgpid] = useState('');
  const [pid,setpid] = useState('');
  const [search,setsearch] = useState('');
  const [zone,setZone] = useState('scr');
  useEffect(() => {
    const getdataoflocal = async () => {
      // check if user is logged in
      
      setmyname(await AsyncStorage.getItem('name'));
      setmyid(await AsyncStorage.getItem('id'));
      setgpid(await AsyncStorage.getItem('parentid'));
      setpid(await AsyncStorage.getItem('id'));
     
    }
    getdataoflocal();
  });
  useEffect(() => {
    const getdataoflocal2 = async () => {
      getuserdata();
    }
    getdataoflocal2();
  },[]);
  const getuserdata  =  async () =>{
   
     try{

      var jsondata = {name:'1'};
      const response = await fetch(BaseUrl+"getdivisions", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      });
      const data = await response.json();
      setDivisions(data);

      const response1 = await fetch(BaseUrl+"getdepartments", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      });
      const data1 = await response1.json();
    //   console.log(data1);
      setDepartments(data1);

     }
     catch (e){
        console.log(e);
     }
  }
  const handleCreateUser = async () => {
    try{

        var jsondata = {
            username:username,
            password:password,
            loginId:loginId,
            email:email,
            phoneNumber:phoneNumber,
            designation:designation,
            department:department,
            division:division,
            parentId:pid,
            grandparentId:gpid,
            status:status,
            role:role,
            zone:zone
          };
        
        const response = await fetch(BaseUrl+"createuser", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsondata),
        });
        const data = await response.json();
        if(data=='success')
        {
            alert('User Created Successfully !');
            navigation.navigate('Task');
        }
    
       }
       catch (e){
          console.log(e);
       }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Member Name</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} />
        </View>
       
        <View style={styles.field}>
          <Text style={styles.label}>Login ID</Text>
          <TextInput style={styles.input} value={loginId} onChangeText={setLoginId} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput  style={styles.input} value={password} onChangeText={setPassword} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType='email-address'/>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType='phone-pad' />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Designation</Text>
          <TextInput style={styles.input} value={designation} onChangeText={setDesignation} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Department</Text>
          <Picker selectedValue={department}
        onValueChange={setDepartment}>
        <Picker.Item label={'SELECT'} value={'--'}   />
        {departments.map(item => (
          <Picker.Item label={item.dept} value={item.dept} key={item.id}  />
        ))}
      </Picker>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Zone</Text>
          <TextInput editable={false} style={styles.input} value={zone} onChangeText={setZone} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Division</Text>
          <Picker style={{borderWidth:1,borderColor:'black'}} selectedValue={division}
        onValueChange={setDivision}>
            <Picker.Item label={'SELECT'} value={'--'}   />
        {divisions.map(item => (
          <Picker.Item label={item.division} value={item.division} key={item.id}  />
        ))}
      </Picker>
        </View>
        {/* <View style={styles.field}>
          <Text style={styles.label}>Parent ID </Text>
          <TextInput style={styles.input} value={pid} onChangeText={setpid} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Grand Parent ID </Text>
          <TextInput style={styles.input} value={gpid} onChangeText={setgpid} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <TextInput style={styles.input} value={status} onChangeText={setStatus} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Role</Text>
          <TextInput style={styles.input} value={role} onChangeText={setRole} />
        </View>*/}
      </View> 
      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0071b3',
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        
      },
      input: {
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 20,
        color:'black'
      },
      button: {
        backgroundColor: '#002e52',
        borderRadius: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});
