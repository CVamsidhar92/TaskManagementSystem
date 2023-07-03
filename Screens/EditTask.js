import { ScrollView, StatusBar } from "react-native";
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

export function EditTask({navigation})  {
  LogBox.ignoreAllLogs();
    const route = useRoute();

    const [loading, setLoading] = useState(false);

    const [taskid,settaskid] = useState(route.params.taskid);
    console.log(route.params);
    const [taskdata,settaskdata] = useState([])
    const [myname,setmyname] = useState('')
    const [myid,setmyid] = useState('')
    const [users,setusers] = useState([])
    
    // state to call after api loads 
    const [isvisible,setisvisible] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [Deadline, setDeadline] = useState(new Date());
    const [description, setDescription] = useState('');
    //const [deadline, setDeadline] = useState('');
    const [responsibleMember, setResponsibleMember] = useState('');
    const [observer, setObserver] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [itemd,setitemsd] = useState('')
    useEffect(() => {
      const getdataoflocal2 = async () => {
        getuserdata1();
      }
      getdataoflocal2();
    },[]);


    useEffect(() => {
        const getdataoflocal2 = async () => {
          getuserdata();
        }
        getdataoflocal2();
      },[]);

      const getuserdata  =  async () =>{
        setLoading(true);
        var jsondata = {id:await AsyncStorage.getItem('id')};
        // console.log(jsondata)
        const response = await fetch(BaseUrl+"getuserdata", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsondata),
        });
        const data = await response.json();
        setLoading(false)
                    setusers(data)
                    //setResponsibleMember(jsonData)
                    //setitemsd(jsonData)
      }
    const getuserdata1 =  async () =>{
     
        const taskdetailsdata = {taskid:taskid,userid:await AsyncStorage.getItem('id')};
        try {
          setLoading(true);
            const response = await fetch(BaseUrl+"gettaskdata", {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(taskdetailsdata),
            });
        
            const result = await response.json();
            //console.log("Success:", result[0]);
            settaskdata(result[0][0]);
            setLoading(false);
            setisvisible(true);
            // setResponsibleMember(taskdata['respo_mem'])
          } catch (error) {
            console.error("Error:", error);
          }
    }
    
    

    useEffect(() => {
        const getdataoflocal2 = async () => {
            setTaskName(taskdata['task_name'])
            setDescription(taskdata['description'])
            try{
                const respodata = (taskdata['respo_mem']).split(',').map((str) => parseInt(str));
                const obsdata = (taskdata['observer']).split(',').map((str) => parseInt(str))
              //   console.log(taskdata['respo_mem'])
              // respodata  = respodata.map((item) =>{
              //   item = parseInt(item);
              // } )
               console.log(respodata)
                
               setselectedItems(respodata);
               setselectedItems1(obsdata);
            //    console.log(selectedItems)
              // console.log('i m changing')
            }
            catch (e){
                // console.log(e);
            }
            try{
                const dateae = JSON.parse(taskdata['deadline']);
                console.log(dateae)
    //             
    const deadlineDate = dateae ? new Date(dateae) : null;
    // console.log(deadlineDate);
    setDeadline(new Date(deadlineDate));
            }
            catch (e){
                // console.log(e);
            }
            finally{
                setisvisible(false);
            }
            
        }
        getdataoflocal2();
      },[isvisible]);
      useEffect(()=>{
        const data = selectedItems.join(',');
        // console.log(data);
        const data2 = selectedItems1.join(',');
        setObserver(data2);
        setResponsibleMember(data);
        
    })
    
    const submithandler = async () => {
    
      // console.log(responsibleMember)
      // console.log(selectedItems)
      //setResponsibleMember(selectedItems)
      console.log(myname,taskName,description,Deadline,responsibleMember,observer)

      if(!taskName || !description || !Deadline || !responsibleMember || !observer)
      {
        alert('enter all fields')
      }
      else{

      setLoading(true);

      const formData = new FormData();
    

    formData.append('taskid',taskid);
      formData.append('taskName', taskName);
      formData.append('description', description);
      
    //   formData.append('id', myid);
      formData.append('Deadline', JSON.stringify(Deadline));
      formData.append('resp', responsibleMember);
      formData.append('obs', observer);
      formData.append('cntr',attachments.length);




      
  
    //   // Add files to the form data object
      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i];
        formData.append(`name${i}`, {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      }
  

      try {
        const response = await fetch(BaseUrl+'updatetaskdata', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = await response.json();
        setLoading(false);
        if(data=='success')
        {
          alert('Task saved Successfully');
          navigation.navigate('Test1');
        }
      } catch (err) {
        //console.log(err);
      }
    }
    
  
    };
  
   
    
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
    //const [Deadline, setDeadline] = useState(new Date());
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
          console.log(Deadline)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
        </View>
       

        <View>
          <Text style={styles.label}>Responsible Members</Text>
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
          onChangeInput={ (text)=> console.log('1')}
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
          <Text style={styles.label}>Observers </Text>
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
          onChangeInput={ (text)=> console.log('1')}
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
              <Text style={styles.text}>Save Task</Text>
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
      borderColor: '#000',
      padding: 5,
    },
    label: {
      fontWeight: 'bold',
      marginRight: 10,
      color:'white'
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
  