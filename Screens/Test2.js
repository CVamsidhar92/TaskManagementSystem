import { ScrollView, StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import DatePicker from "react-native-date-picker";
import { RadioButton } from "react-native-paper";
import { BaseUrl } from "./BaseUrl";
import Icon from 'react-native-vector-icons/FontAwesome';
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
  Modal,
  SafeAreaView,

} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moment from 'moment'

export function Test2({ navigation }) {

  const route = useRoute();
  const ref = route.params.ref;
  const id = route.params.id;
  console.log(route.params);


  // FILTER STATE
  const [Deadline, setDeadline] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('task');
  const [taskName, setTaskName] = useState('');
  const [designation, setDesignation] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatepicker, setShowFromDatepicker] = useState(false);
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [selectedItemsFilter , setselectedItemsFilter ] = useState([]);
const [createdbyFilter, setCreatedbyFilter] = useState([]); 


  const [users,setusers] = useState([])

  const getuserdata  =  async () =>{
     
    // var jsondata = {name:'1'};
    // const response = await fetch("https:bzadevops.co.in/TaskManagementApplication/tma_bk/api/getuserdata", {
    //   method: "POST", 
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(jsondata),
    // });
    // const data = await response.json();
    // console.log(data);
    const response = await fetch(BaseUrl+"getuserdata");
              const jsonData = await response.json();
              console.log(jsonData)
              setusers(jsonData)
} 

  const items = users;
  const [selectedItems , setselectedItems ] = useState([]);
  const [selectedItems1 , setselectedItems1 ] = useState([]);



  //Search Variables
  const [filteredDataSource, setFilteredDataSource] =useState([]);
  const [masterDataSource, setMasterDataSource] =useState([]);

  const handleFilterPress = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleRadioSelect = (radioValue) => {
    setSelectedRadio(radioValue);
  };

//Search Start

  // Search Function
  const searchFilter =(text) => {
    if (text) {
      const newData = masterDataSource.filer(
        function (item) {
          const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexof(textData) > -1;
        }
      );

      setFilteredDataSource(newData);
      ScreenStackHeaderSearchBarView(text);

    }else{
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  //Seperator View
  const ItemSeperatorView =() => {
    return(
      <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8'
      }}
      />
    )
  }
//Search End


  const handleApplyFilter = () => {
    // Apply filter logic goes here
    // console.log('Selected Radio:', selectedRadio);
    // console.log('Task Name:', taskName);
    // console.log('Designation:', designation);
    // const dateae = (fromDate);
    //             console.log(dateae)
    // //             
    // const deadlineDate = dateae ? new Date(dateae) : null;
    // // console.log(deadlineDate);
    // // console.log(new Date(deadlineDate));
    // console.log('From Date:', fromDate);
    // console.log('To Date:', toDate);

    var data = JSON.stringify(selectedItemsFilter.join(','));
    setCreatedbyFilter(data);

    if (selectedRadio == 'task') {
      getfilterdataapi(selectedRadio, '', '', taskName, '');
    }
    else if (selectedRadio == 'designation') {
      getfilterdataapi(selectedRadio, '', '', '', designation);
    }
    else if (selectedRadio == 'deadline') {
      getfilterdataapi(selectedRadio, fromDate, toDate, '', '');
    }
    else if (selectedRadio == 'createdby') {
      getfilterdataapi(selectedRadio,  '', '', '', createdby);
    }

    handleCloseModal();
  };

  const getfilterdataapi = async (name, fromdatee, todatee, taskName, designation) => {
    if (name == 'task' || name == 'designation') {
      const jsondata = { name: name, refernce: ref, taskname: taskName, desig: designation, id: id };

      // console.log(jsondata)
      try {
        const response = await fetch(BaseUrl + 'getfilterdata', {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsondata),
        });

        const result = await response.json();
        // console.log("Success:", result);
        //console.log(result.length);
        if (result.length) {
          setfilterdata(result);
          alert('filtered successfully')
        }
        else {
          alert('No data available on applied filter')
        }

      } catch (error) {
        console.error("Error:", error);
      }
    }
    else {
      const jsondata = { status: name, fromDate: fromdatee, toDate: todatee, refernce: ref, id: id };
      // console.log(jsondata);
      try {
        const response = await fetch(BaseUrl + 'getfilterdata', {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsondata),
        });

        const result = await response.json();
        // console.log("Success:", result);
        //console.log(result.length);
        if (result.length) {
          setfilterdata(result);
          alert('filtered successfully')
        }
        else {
          alert('No data available on applied filter')
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  useEffect(() => {
    const getdataoflocal2 = async () => {
      getuserdata();
    }
    getdataoflocal2();
  },[]);

  // changed useffect to useeffect,[]
  useEffect(() => {
    navigation.addListener('focus', () => {
      if (ref === 'active') {
        getactive();
      }
      else if (ref === 'completed') {
        getcompleted();
      }
      else {
        getoverdue();
      }
    })
  }, [])

  const [data, setdata] = useState([]);
  const [filterdata, setfilterdata] = useState([]);
  const getactive = async () => {
    const activedata = { status: 'active', myid: id };
    // console.log(activedata);
    try {
      const response = await fetch(BaseUrl + 'senddata', {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activedata),
      });

      const result = await response.json();
      //   console.log("Success:", result);
      //console.log(result.length);
      setdata(result);
      setfilterdata(result);
    } catch (error) {
      console.error("Error:", error);
    }

  }

  const getcompleted = async () => {
    const activedata = { status: 'completed', myid: id };
    try {
      const response = await fetch(BaseUrl + 'senddata', {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activedata),
      });

      const result = await response.json();
      //console.log("Success:", result);
      //console.log(result.length);
      setdata(result);
      setfilterdata(result);
    } catch (error) {
      console.error("Error:", error);
    }

  }

  const getoverdue = async () => {
    const activedata = { status: 'overdue', myid: id };
    try {
      const response = await fetch(BaseUrl + 'senddata', {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activedata),
      });

      const result = await response.json();
      //console.log("Success:", result);
      //console.log(result.length);
      setdata(result);
      setfilterdata(result);
    } catch (error) {
      console.error("Error:", error);
    }

  }

  const renderTableItem = ({ item }) => (
    <TouchableOpacity onPress={() =>{console.log('this is id '+id); navigation.navigate('TaskDetails', { taskid: item.id , id:id })}} >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.taskName}>{item.task_name}</Text>
          {/* <Text style={styles.deadline}>{item.deadline}</Text> */}
        </View>
        <View style={styles.content}>
          {/* <Text style={styles.description}>Description : {item.description}</Text> */}
          {/* <Text style={styles.responsiblePerson}>Responsible Person: {item.respnames}</Text> */}
          {/* <Text style={styles.observerPerson}>Observer Person: {item.obsnames}</Text> */}
          {/* <Text style={styles.createdby}>Created by: {item.createdname}</Text> */}
          <Text style={styles.deadline}>Deadline: <Text style={{fontWeight:'bold'}}>{moment(JSON.parse(item.deadline)).format('DD-MM-YYYY')}</Text></Text>
       
        <View style={styles.footer}>
          <Text style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "black",
            backgroundColor: '#add8e6',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
          }}>{ref == 'active' ? 'active' : (ref === 'completed' ? 'completed' : 'overdue')}</Text>
        </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0071b3',maxHeight:'auto',paddingBottom:80 }}>
      <View>
<TextInput 
style ={styles.searchbar}
underlineColorAndroid="transparent"
 placeholder="Search Here"/>
        {/* filter code  */}
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={handleFilterPress}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 10 }}><Icon name="filter" size={30} color="white" /></Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleCloseModal}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  padding: 16,
                  height: '60%',
                }}>
                {/* Filter options go here */}
                <View style={styles.modalBackdrop}>
                  <View style={styles.modalContainer}>
                    <TouchableOpacity
                      onPress={handleCloseModal}
                      style={styles.closeButton}>
                      <Text style={styles.closeButtonText}><Icon name="close" size={30} color="#002e52" /></Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Filter Options</Text>
                    <View style={styles.radioGroup}>
                      <Text style={styles.radioLabel}>Filter By:</Text>
                      <View style={styles.radioButtons}>
                        <View style={styles.radioButton}>
                          <RadioButton
                            value="task"
                            status={selectedRadio === 'task' ? 'checked' : 'unchecked'}
                            onPress={() => handleRadioSelect('task')}
                          />
                          <Text style={styles.radioButtonText}>Task Name</Text>
                        </View>
                        <View style={styles.radioButton}>
                          <RadioButton
                            value="designation"
                            status={
                              selectedRadio === 'designation' ? 'checked' : 'unchecked'
                            }
                            onPress={() => handleRadioSelect('designation')}
                          />
                          <Text style={styles.radioButtonText}>Designation</Text>
                        </View>                       
                      </View>


                      <View style={styles.radioButtons}>
                      <View style={styles.radioButton}>
                          <RadioButton
                            value="deadline"
                            status={selectedRadio === 'deadline' ? 'checked' : 'unchecked'}
                            onPress={() => handleRadioSelect('deadline')}
                          />
                          <Text style={styles.radioButtonText}>Deadline</Text>
                        </View>
                        <View style={styles.radioButton}>
                          <RadioButton
                            value="createdby"
                            status={
                              selectedRadio === 'createdby' ? 'checked' : 'unchecked'
                            }
                            onPress={() => handleRadioSelect('createdby')}
                          />
                          <Text style={styles.radioButtonText}>Created By</Text>
                        </View>                       
                      </View>
                    </View>
                    {selectedRadio === 'task' && (
                      <View style={styles.inputGroup}>
                        <TextInput
                          placeholderTextColor='#003f5c'
                          style={styles.textInput}
                          placeholder="Enter task name"
                          onChangeText={(text) => setTaskName(text)}
                        />
                      </View>
                    )}
                    {selectedRadio === 'designation' && (
                      <View style={styles.inputGroup}>
                        <TextInput
                          style={styles.textInput}
                          placeholderTextColor='#003f5c'
                          placeholder="Enter designation"
                          onChangeText={(text) => setDesignation(text)}
                        />
                      </View>
                    )}
                    {selectedRadio ==='createdby' && (
                       <MultiSelect
                       hideTags
                       items={items}
                       uniqueKey="id"
                       ref={(component) => { this.multiSelect = component }}
                       onSelectedItemsChange={setselectedItemsFilter}
                       selectedItems={selectedItemsFilter}
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
                    )}
                    {selectedRadio === 'deadline' && (
                      <View style={styles.inputGroup}>
                        <View style={styles.datePickerGroup}>
                          <Text style={styles.datePickerLabel}>From:</Text>
                          <View style={styles.field}>
                            {/* <Text style={styles.label}>Deadline</Text> */}
                            <TouchableOpacity onPress={() => setOpen(true)}>

                              <View style={styles.row} >
                                <Text style={styles.label}>Date  : </Text>
                                <Text style={(styles.label, { marginBottom: 4, color: 'black' })}>
                                  {moment(fromDate).format('DD/MM/YYYY')
                                    ? moment(fromDate).format('DD/MM/YYYY')
                                    : 'Select Deadline*'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            {/* <Button title="Select Date" onPress={() => setOpen(true)} /> */}
                            <DatePicker
                              modal
                              open={open}
                              date={fromDate}
                              mode="date"
                              onConfirm={(fromDate) => {
                                setOpen(false)
                                setFromDate(fromDate)
                                // console.log(Deadline)
                              }}
                              onCancel={() => {
                                setOpen(false)
                              }}
                            />
                          </View>
                        </View>
                        <View style={styles.datePickerGroup}>
                          <Text style={styles.datePickerLabel}>To:</Text>
                          <View style={styles.field}>
                            {/* <Text style={styles.label}>Deadline</Text> */}
                            <TouchableOpacity onPress={() => setOpen1(true)}>

                              <View style={styles.row1} >
                                <Text style={styles.label}>Date  : </Text>
                                <Text style={(styles.label, { marginBottom: 4, color: 'black' })}>
                                  {moment(toDate).format('DD/MM/YYYY')
                                    ? moment(toDate).format('DD/MM/YYYY')
                                    : 'Select Deadline*'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            {/* <Button title="Select Date" onPress={() => setOpen(true)} /> */}
                            <DatePicker
                              modal
                              open={open1}
                              date={toDate}
                              mode="date"
                              onConfirm={(toDate) => {
                                setOpen1(false)
                                setToDate(toDate)
                                // console.log(Deadline)
                              }}
                              onCancel={() => {
                                setOpen1(false)
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={handleApplyFilter}
                      style={styles.applyButton}>
                      <Text style={styles.applyButtonText}>Apply Filter</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ paddingVertical: 10, paddingHorizontal: 8 }}>
        <FlatList
          data={filterdata}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => {
            <View style={styles.card}>
              <Text>NOT DATA AVAILABLE</Text>
            </View>
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffff0",
    borderRadius: 4,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deadline: {
    fontSize: 16,
    color: "black",
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection:'row'
  },
  description: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  responsiblePerson: {
    fontSize: 14,
    color: "black",
  },
  observerPerson: {
    fontSize: 14,
    color: "black",
    marginBottom: 5,
  },
  createdby: {
    fontSize: 14,
    color: "black",
    marginBottom: 5,
  },
  footer: {
    // flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft:'30%'
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 20,
    width: '100%',
    maxHeight: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black'
  },
  radioGroup: {
    marginVertical: 10,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  radioButtons: {

    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    fontSize: 16,

    color: 'black'
  },
  inputGroup: {
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'black'
  },
  datePickerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  datePickerLabel: {
    fontSize: 15,
    marginRight: 10,
    color: 'black'
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#002e52',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
    color: 'black'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 5,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginLeft: 18,
    padding: 5,
  },

  field: {
    marginBottom: 5,
  },
  searchbar: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin:10,
    borderColor: '#009688',
    backgroundColor: '#ffffff'

  }
});