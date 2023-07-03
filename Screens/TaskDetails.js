import { ScrollView, StatusBar } from "react-native";
import React, { useState , useEffect  } from "react";
import { useRoute } from '@react-navigation/native';
import DocumentPicker from "react-native-document-picker";

import DatePicker from "react-native-date-picker";
import {Picker} from '@react-native-picker/picker';
import moment from 'moment'

// multiselect
import MultiSelect from 'react-native-multiple-select';
import { TaskCard } from "./TaskCard";
import Icon from 'react-native-vector-icons/FontAwesome';
// import DocumentPicker from "react-native-document-picker";
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
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "./BaseUrl";

import Clipboard from '@react-native-community/clipboard';

export function TaskDetails({navigation}){

    const route = useRoute();
    console.log(route.params);
    const [taskid,settaskid] = useState(route.params.taskid);
    const [userid,setuserid] = useState(route.params.userid);
    const [enablescollview,setenablescrollveiw] = useState(true);
    const [taskdata,settaskdata] = useState('');
    const [filesdata,setfilesdata] = useState([]);
    const [myid,setmyid] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [myname,setmyname] = useState('')
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      navigation.addListener('focus', () => {
        const getdataoflocal2 = async () => {
          //getuserdata();
          setmyid(await AsyncStorage.getItem('id'));
          setmyname(await AsyncStorage.getItem('name'));
          getdata();
          getchatdata();
        }
        getdataoflocal2();
      })
    },[]);
      const getchatdata= async()=>{
        setLoading(true);
        try {
            const jsondata = {taskid:taskid,id:await AsyncStorage.getItem('id')};
            console.log(jsondata);
            const response = await fetch(BaseUrl+"getchatdata", {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsondata),
            });
        
            const result = await response.json();
            console.log("Success:", result[1]);
            
            setMessages(result);
            if(!loading)
            {
              //setTimeout(() => {
                setLoading(false);
                // Handle API response
                // ...
              //}, 1000);
            }
          } catch (error) {
            console.error("Error:", error);
          }
      }
      var tddeadline=''
      const getdata = async () =>{
        const taskdetailsdata = {taskid:taskid,userid:await AsyncStorage.getItem('id')};
        setLoading(true);
    try {
      const response = await fetch(BaseUrl+"gettaskdata", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskdetailsdata),
      });
  
      const result = await response.json();

       console.log("Success:", result);
      //console.log(moment(JSON.parse(result[0][0]['deadline'])).format('DD-MM-YYYY'))
      this.tddeadline = moment(JSON.parse(result[0][0]['deadline'])).format('DD-MM-YYYY')
      settaskdata(result[0][0]);
    
      
      setfilesdata(result[1])
      if(!loading)
      {
        //setTimeout(() => {
          setLoading(false);
          // Handle API response
          // ...
       // }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
      }
     
      
      
    taskName = taskdata.task_name;
    description = taskdata.description;
    deadline = this.tddeadline;
    responsiblePerson = taskdata.respnames;
    observerPerson = taskdata.obsnames;
    createdby = taskdata.createdname;
    createddesig = taskdata.created_desig;
    files = 'files ex';
    //const { taskName, description, deadline, responsiblePerson, observerPerson, files } = {taskName, description, deadline, responsiblePerson, observerPerson, files};
    const [messages, setMessages] = useState([]);

      const [newMessage, setNewMessage] = useState('');

      const handledocument = async () => {
        try {
          const results = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.allFiles],
          });
          
          sendfiledata(results);
        } catch (error) {
          // console.log('Error picking multiple files:', error);
        }
      };

      const sendfiledata = async (results) =>{
         console.log(myid,taskid,responsiblePerson,results.length,myname);
        const id = Math.random().toString(36).substr(2, 9);
          const uname = myname;
          const msg = '-';
          const file = 'file sent';
          const newMsg = { id, uname, msg , file};
          setMessages([...messages, newMsg]);
          setNewMessage('');
        const formData = new FormData();
        formData.append('myname',myname)
        formData.append('userid',myid);
        formData.append('taskid',taskid);
        formData.append('replyto',responsiblePerson);
        formData.append('cntr',results.length);
        for (let i = 0; i < results.length; i++) {
            const file = results[i];
            formData.append(`name${i}`, {
              uri: file.uri,
              type: file.type,
              name: file.name,
            });
          }
          try {
            const response = await fetch(BaseUrl+'uploadfilechat', {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            const data = await response.json();
            // console.log(data);
            if(data=='success')
            {
              alert('File Sent Successfully');
            }
          } catch (err) {
            console.log(err);
          }
      }

      const handleSend =async () => {
        if (newMessage.trim() !== '') {
            Keyboard.dismiss();
          const id = Math.random().toString(36).substr(2, 9);
          const uname = myname;
          const msg = newMessage.trim();
          const file = '-';
          const newMsg = { id, uname, msg , file};
          setMessages([...messages, newMsg]);
          setNewMessage('');
        
        try{
            const mychat = {msg:msg,myid:myid,taskid:taskid,myname:myname};
             console.log(mychat);
            // console.log(myid,taskid,message,myname);
            const response = await fetch(BaseUrl+'uploadchat', {
                method: 'POST',
                body: JSON.stringify(mychat),
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = await response.json();
              // console.log(data);
              if(data=='success')
              {
                alert('Message Sent Successfully');
              }
        }
        catch (e){
            console.log(e);
        }
    }
      };

      const handledelete = async  () =>{
        if(myid===taskdata.req_id &&  taskdata.task_stat!='completed'){
        const jsondata = {taskid:taskid};
        
        try{
        const response = await fetch(BaseUrl+"deletedtask", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsondata),
        });
        const data = await response.json();
        if(data=='success')
        {
            alert(
                'Deleted Task Successfully'
            );
            // console.log('deleted')
            navigation.navigate('Test1');
        }
        }
        catch (e){
            console.log(e);
        }
    }
    else{
        if(taskdata.task_stat=='completed')
        {
            alert('task already completed')
        }
        else{
            alert('No access!')
        }
        
    }
        
      }

      const handlecomplete = async () =>{
        if(taskdata['task_stat']=='completed')
        {
            alert('Already Completed ')
        }
        else{
            if(myid===taskdata.req_id ){

            
            const jsondata = {taskid:taskid,myname:myname};
            console.log(jsondata);
            try{
            const response = await fetch(BaseUrl+"makecompletetask", {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsondata),
            });
            const data = await response.json();
            if(data=='success')
            {
                alert(
                    'Changed Task Status to Completed Successfully'
                );
                // console.log('complete pressed')
                navigation.navigate('Test1');
            }
            }
            catch (e){
                console.log(e);
            }
        }
        else{
        
            alert('No access!')
        }
    }
        
      }

        return (
            <View style={{ flex: 1 , backgroundColor:'#0071b3'}}>
              <ScrollView nestedScrollEnabled={true} >
              <Spinner
        visible={loading}
        textContent={"Loading chat/display ..."}
      />
      <TaskCard
        task={{
          taskName: taskName,
          description: description,
          deadline: deadline,
          responsiblePerson: responsiblePerson,
          observerPerson:observerPerson,
          CreatedBy:createdby,
          createddesig:createddesig,

          files: filesdata,
        }}
        onEdit={() => {
            if(myid===taskdata.req_id  &&  taskdata.task_stat!='completed')
            {
             // alert('hi same id '+myid+' '+myid)
             
             navigation.navigate('EditTask',{taskid:taskid})
            }
            else{
                if(taskdata.task_stat=='completed')
                {
                    alert('task already completed')
                }
                else{
                    alert('No access!')
                }
                
            }
            
         }}
        onDelete={handledelete}
        onComplete={handlecomplete}
        navigation={navigation}
      />
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 ,color:"white"}}><Icon name="comments-o" size={25} color="white"  /> CHAT </Text>
        
        <FlatList 
        nestedScrollEnabled 
        maxHeight={400}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            <View style={{ marginBottom: 10, flexDirection: item.uname !== myname ? 'row' : 'row-reverse' }}>
              <View style={{ backgroundColor: item.uname !== myname ? '#f0f0f0' : '#d6eaf8', borderRadius: 10, padding: 10, maxWidth: '80%' }}>
                <Text style={{ textAlign: item.uname !== myname ? 'left' : 'right', fontWeight: 'bold', marginBottom: 5 , color:'black' }}>
                  {item.uname !== myname ? item.uname : myname}   {item.dt}
                </Text>
                
                {item.file=='-'? <TouchableOpacity onPress={() => Clipboard.setString(item.msg)}><Text style={{ textAlign: item.uname !== myname ? 'left' : 'right' , color:'black' }}>{item.msg}</Text></TouchableOpacity>:(
                <TouchableOpacity key={item.id} onPress={() => {
                    const fileext = item.file.slice((item.file.lastIndexOf(".") - 1 >>> 0) + 2);
                  
                    navigation.navigate('Fileview',{filename:item.file,fileexten:fileext})}}>
              <Text style={{ textAlign: item.uname !== myname ? 'left' : 'right' , color:'blue' }}>{item.file}</Text>
            </TouchableOpacity>)}
                
              </View>
            </View>
          )}
            
        />
        {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
       
          <TextInput
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginRight: 10, padding: 5 ,height:50}}
            placeholder="Type your message here"
            value={newMessage}
            onChangeText={setNewMessage}
          />
        <TouchableOpacity onPress={handledocument}>
            <View >
        <Icon style={{padding:10}} name="paperclip" size={25} color="white"/></View>
        </TouchableOpacity>
          <TouchableOpacity
            style={{  padding: 15, borderRadius: 5 }}
            onPress={handleSend}
          >
            <Text><Icon name="send" size={25} color="white"  /></Text>
          </TouchableOpacity>
        </View> */}
      </View>
      </ScrollView>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
       
          <TextInput
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginRight: 10, padding: 5 ,height:50}}
            placeholder="Type your message here"
            value={newMessage}
            onChangeText={setNewMessage}
          />
        <TouchableOpacity onPress={handledocument}>
            <View >
        <Icon style={{padding:10}} name="paperclip" size={25} color="white"/></View>
        </TouchableOpacity>
          <TouchableOpacity
            style={{  padding: 15, borderRadius: 5 }}
            onPress={handleSend}
          >
            <Text><Icon name="send" size={25} color="white"  /></Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}