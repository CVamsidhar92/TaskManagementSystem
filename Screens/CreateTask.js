import { Alert, ScrollView, StatusBar } from "react-native";
import React, { useState , useEffect  } from "react";
import { useRoute } from '@react-navigation/native';
import DocumentPicker from "react-native-document-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from "react-native-date-picker";
import {Picker} from '@react-native-picker/picker';
import moment from 'moment'

// multiselect
import MultiSelect from 'react-native-multiple-select';


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
  SafeAreaView,
  LogBox
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "./BaseUrl";


export function CreateTask({navigation})  {
  LogBox.ignoreAllLogs();
  const [loading, setLoading] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    //const [deadline, setDeadline] = useState('');
    const [responsibleMember, setResponsibleMember] = useState('');
    const [observer, setObserver] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [myname,setmyname] = useState('');
    const[createddesig,setcreateddesig] = useState('');
    const [myid,setmyid] = useState('')
    const [users,setusers] = useState([])
    useEffect(() => {
      const getdataoflocal = async () => {
        // check if user is logged in
        
        setmyname(await AsyncStorage.getItem('name'));
        setcreateddesig(await AsyncStorage.getItem('desg'));
        setmyid(await AsyncStorage.getItem('id'));
        setResponsibleMember(selectedItems);
        setObserver(selectedItems1);
        
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
      setLoading(true);
        var jsondata = {id:await AsyncStorage.getItem('id')};
        console.log(jsondata)
        const response = await fetch(BaseUrl+"getuserdata", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsondata),
        });
        const data = await response.json();
        console.log(data);
       
        // const response = await fetch(BaseUrl+"getuserdata");
                  // const jsonData = await response.json();
                  // console.log(jsonData)
                  setusers(data)
                  //setTimeout(() => {
                    setLoading(false);
                    // Handle API response
                    // ...
                  //}, 2000);
    }
    
    const submithandler = async () => {
      
      var data = JSON.stringify(selectedItems.join(','));
      var data2 = JSON.stringify(selectedItems1.join(','));
      //console.log(data);
      setResponsibleMember(data);
      // console.log(selectedItems)
        setObserver(data2);
      if(taskName && description && Deadline && data.length>2 && data2.length>2)
      {
        setLoading(true);
      
      //console.log(myname,taskName,description,Deadline,responsibleMember,observer)
      const formData = new FormData();
      const mydata = {
        createdby:myname,
        createddesig:createddesig,
        taskName:taskName,
        description:description,
        id:myid,
        Deadline:Deadline,
        resp:JSON.stringify(responsibleMember),
        obs:JSON.stringify(observer),
      }
      // Add other data to the form data object
      formData.append('createdby', myname);
      formData.append('createddesig', createddesig);
      formData.append('taskName', taskName);
      formData.append('description', description);
      
      formData.append('id', myid);
      formData.append('Deadline', JSON.stringify(Deadline));
      formData.append('resp', responsibleMember);
      formData.append('obs', observer);
      formData.append('cntr',attachments.length);




      
  
      // Add files to the form data object
      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i];
        formData.append(`name${i}`, {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      }
  
      // Send the form data to the server
      // const response = await fetch('https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/uploadtask', {
      //   method: "POST", 
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(mydata),
      // });

      try {
        const response = await fetch(BaseUrl+'uploadtask', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = await response.json();
        console.log(formData);
        if(data=='success')
        {
          //setTimeout(() => {
            setLoading(false);
            // Handle API response
            // ...
          //}, 1000);
          alert('Task Created Successfully');
          navigation.navigate('Test1');
        }
      } catch (err) {
        console.log(err);
      }
      }
      else{
        alert('Enter / Select all Fields')
      }
  
      // Handle the response from the server
      // const data = await response.json();
      // console.log(data);
    };
  
    //const myname = AsyncStorage.getItem('name');
    // submithandler = async () =>{
    //   console.log(taskName,description,Deadline,responsibleMember,observer)
    // }
    
    const handleDocumentPicker = async () => {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.allFiles],
        });
        setAttachments(results);
      } catch (error) {
        console.log('Error picking multiple files:', error);
      }
    };

    // date time picker 
    const [Deadline, setDeadline] = useState(new Date());
    const [open, setOpen] = useState(false);

    // Multiselect Trail
    // Dummy Data for the MutiSelect
    const items = users;

  const [selectedItems , setselectedItems ] = useState([]);

  const [selectedItems1 , setselectedItems1 ] = useState([]);

// end of trail
    return (
      <SafeAreaView style={{ flex:1,backgroundColor:'#0071b3'}}>
         <Spinner
        visible={loading}
        textContent={"Loading..."}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Task Name</Text>
          
          <TextInput
            style={(styles.input)}
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>
       
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          {/* <Text style={styles.label}>Deadline</Text> */}
          <TouchableOpacity onPress={() => setOpen(true)}>
             
              <View style={styles.row} >
        <Text style={styles.label}>Deadline : </Text>
        <Text style={(styles.label, { marginBottom: 4 })}>
                {moment(Deadline).format('DD/MM/YYYY')
                  ?moment(Deadline).format('DD/MM/YYYY')
                  : 'Select Deadline*'}
              </Text>
      </View>
            </TouchableOpacity>
          {/* <Button title="Select Date" onPress={() => setOpen(true)} /> */}
      <DatePicker
        modal
        open={open}
        date={Deadline}
        mode="date"
        onConfirm={(Deadline) => {
          setOpen(false)
          setDeadline(Deadline)
          // console.log(Deadline)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
        </View>
       
{/* <View style={styles.inputView}>

            <DatePicker
              modal
              open={open}
              date={Deadline}
              mode="date"
              onConfirm={(Deadline) => {
                console.log('DateofBirth -', Deadline);
                setOpen(false);
                setDeadline(Deadline);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={(styles.input, { marginTop: -8 })}>
                {moment(Deadline).format('DD/MM/YYYY')
                  ? moment(Deadline).format('DD/MM/YYYY')
                  : 'DOB*'}
              </Text>
            </TouchableOpacity>
          </View> */}

        <View>
          <Text style={styles.label}>Responsible Member</Text>
          <View>
        <MultiSelect
          hideTags
          items={items}
          flatListProps={{keyboardShouldPersistTaps:"handled"}}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={setselectedItems}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#002e52"
          tagBorderColor="#002e52"
          tagTextColor="#002e52C"
          selectedItemTextColor="#002e52"
          selectedItemIconColor="#002e52"
          itemTextColor="#000"
          displayKey="designation"
          searchInputStyle={{ color: '#002e52' }}
          submitButtonColor="#002e52"
          submitButtonText="SELECT"
        />
        {/* <View>
          <Text>
          {selectedItems.join(', ')}
          </Text>
        </View> */}
      </View>
        </View>



        <View>
          <Text style={styles.label}>Observer</Text>
          <View>
            
        <MultiSelect
          hideTags
          items={items}
          flatListProps={{keyboardShouldPersistTaps:"handled"}}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={setselectedItems1}
          selectedItems={selectedItems1}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#002e52"
          tagBorderColor="#002e52"
          tagTextColor="#002e52C"
          selectedItemTextColor="#002e52"
          selectedItemIconColor="#002e52"
          itemTextColor="#000"
          displayKey="designation"
          searchInputStyle={{ color: '#002e52' }}
          submitButtonColor="#002e52"
          submitButtonText="SELECT"
       
        />
        <View>
          <Text>
          {selectedItems1.join(', ')}
          </Text>
        </View>
      </View>
        </View>

       
        <View style={styles.field}>
          <Text style={styles.label}>Attachments</Text>
          <Button
            title="Attach"
            onPress={handleDocumentPicker}
            style={styles.attachButton}
          />
          {attachments.map((file) => (
            <Text key={file.uri}>{file.name}</Text>
             //<Image source={attachments} ></Image>
          ))}
        </View>

        <View>
        <TouchableOpacity onPress={submithandler} style={styles.button}>
              <Text style={styles.text}>Submit Task</Text>
        </TouchableOpacity>
        </View>
        
      </View>
      </ScrollView>
      </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#002e52',
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin:10,
   
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width:'90%',
  },
  inputView:{
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    height: 50,
  color: 'gray',
  fontWeight: '600',
  fontSize: 15,
  },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor:'#0071b3',
    },
    field: {
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 16,
      color: '#333',
      backgroundColor:'#f8f8ff',
    },
    multiline: {
      height: 100,
      textAlignVertical: 'top',
    },
    picker: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
    },
    pickerItem: {
      fontSize: 16,
    },
    attachButton: {
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius:4,
      padding: 5,
    },
    label: {
      fontWeight: 'bold',
      marginRight: 10,
    },
    value: {
      flex: 1,
      fontWeight: 'bold',
    },
  });
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingText: {
    padding: 8,
  },
});
  