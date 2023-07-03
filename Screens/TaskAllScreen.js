import React, { useState, useEffect } from "react";
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
    ScrollView,
    StatusBar
} from "react-native";
import { useRoute } from '@react-navigation/native';
import DatePicker from "react-native-date-picker";
import { RadioButton } from "react-native-paper";
import { BaseUrl } from "./BaseUrl";
import Icon from 'react-native-vector-icons/FontAwesome';
import MultiSelect from 'react-native-multiple-select';
import moment from 'moment'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { TaskDetails } from "./TaskDetails";
import Spinner from 'react-native-loading-spinner-overlay';
export default function TaskAllScreen() {
    const navigation = useNavigation();

    const route = useRoute();
    const ref = route.params.ref;
    const id = route.params.id;
   
    var color;
    if(ref=='active')
    {
        this.color = '#add8e6'
    }
    else if(ref=='overdue')
    {
        this.color = '#f08080';
    }
    else{
        this.color = '#20b2aa';
    }
    var todaydate = new Date();
    var mtodaydate = moment(toDate).format('DD-MM-YYYY');
    
    const { userId, filter } = route.params;
    // FILTER STATE
    const [loading, setLoading] = useState(false);
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
    const [selectedItemsFilter, setselectedItemsFilter] = useState([]);
    const [createdbyFilter, setCreatedbyFilter] = useState([]);

    const [users, setusers] = useState([])

    const items = users;
    const [selectedItems, setselectedItems] = useState([]);
    const [selectedItems1, setselectedItems1] = useState([]);

    const getuserdata = async () => {
        const response = await fetch(BaseUrl + "getuserdata");
        const jsonData = await response.json();
        //console.log(jsonData)
        setusers(jsonData)
    }
    const handleFilterPress = () => {
        setVisible(true);
        setselectedItemsFilter([]);
        
    };

    const handleCloseModal = () => {
        setVisible(false);
    };

    const handleRadioSelect = (radioValue) => {
        setSelectedRadio(radioValue);
    };
    const handleApplyFilter = () => {
        var data = JSON.stringify(selectedItemsFilter.join(','));
        //setCreatedbyFilter(data);
        // console.log(data);

        if (selectedRadio == 'task') {
            if(taskName)
            {

            
            getfilterdataapi(selectedRadio, '', '', taskName, '','');
            }
            else{
                alert('Enter the taskname to filter')
            }
        }
        else if (selectedRadio == 'designation') {
            if(designation)
            {
                getfilterdataapi(selectedRadio, '', '', '', designation,'');
            }
            else{
                alert('Enter the designation to filter')
            }
            
        }
        else if (selectedRadio == 'deadline') {
            if(fromDate && toDate)
            {
                getfilterdataapi(selectedRadio, fromDate, toDate, '', '','');
            }
            else{
                alert('Select dates to filter')
            }
            
        }
        else if (selectedRadio == 'createdby') {
            if(data.length>2)
            {
                getfilterdataapi(selectedRadio, '', '', '', '',data);
            }
            else{
                alert('Select the designation to filter data')
            }
            
        }

        handleCloseModal();
    };

    const getfilterdataapi = async (name, fromdatee, todatee, taskName, designation,createdby) => {
        if (name == 'task' || name == 'designation' || name=='createdby') {
            const jsondata = { name: name, refernce: ref, taskname: taskName, desig: designation, id: id,createdby:createdby};

            try {
                const response = await fetch(BaseUrl + 'getfilterdata', {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsondata),
                });

                const result = await response.json();
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
    }, []);

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
        setLoading(true);
        try {
            const response = await fetch(BaseUrl + 'senddata', {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(activedata),
            });


            const result = await response.json();
            //setTimeout(() => {
                setLoading(false);
                // Handle API response
                // ...
             // }, 2000);
              console.log("Success:", result);
            //console.log(result.length);
            setdata(result);
            setfilterdata(result);
        } catch (error) {
            console.error("Error:", error);
        }

    }

    const getcompleted = async () => {
        const activedata = { status: 'completed', myid: id };
        setLoading(true);
        try {
            const response = await fetch(BaseUrl + 'senddata', {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(activedata),
            });

            const result = await response.json();
            //setTimeout(() => {
                setLoading(false);
                // Handle API response
                // ...
            //  }, 2000);
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
        setLoading(true);
        try {
            const response = await fetch(BaseUrl + 'senddata', {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(activedata),
            });

            const result = await response.json();
            //setTimeout(() => {
                setLoading(false);
                // Handle API response
                // ...
            //  }, 2000);
        //   console.log("Success:", result);
            //console.log(result.length);
            setdata(result);
            setfilterdata(result);
        } catch (error) {
            console.error("Error:", error);
        }

    }

const handleNavigate = (item) => {
  navigation.navigate('TaskDetails', { taskid: item.id,userid:id });
};

    const renderTableItem = ({ item }) => {
        const currentDate = new Date();
  const deadlineDate = new Date(JSON.parse(item.deadline));

  const isDeadlineExpired = deadlineDate < currentDate;
 //console.log(deadlineDate)
  const backgroundColor1 = isDeadlineExpired  ? '#f08080' : '#fffff0';
        
        return(
        
        <TouchableOpacity onPress={ () => handleNavigate(item)} >

            <View style={{backgroundColor: (isDeadlineExpired && ref!=='completed' && ref!=='overdue') ? '#f08080' : '#fffff0',
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

        elevation: 5,}}>
                <View style={styles.header}>
                    <Text style={{fontSize: 18,
        fontWeight: "bold",
        color: (isDeadlineExpired && ref!=='completed' && ref!=='overdue')?'#fffff0':'black',}}>{item.task_name}</Text>
                    {(ref!=='completed' && item.seen == 0) ? 
                    <Text style={styles.msgcount}>{item.chatcount}</Text>
                    :null}
                </View>
                <View style={styles.content}>
                    {/* <Text style={styles.description}>Description : {item.description}</Text> */}
                    {/* <Text style={styles.responsiblePerson}>Responsible Person: {item.respnames}</Text> */}
                    {/* <Text style={styles.observerPerson}>Observer Person: {item.obsnames}</Text> */}
                    {/* <Text style={styles.createdby}>Created by: {item.chatcount}</Text> */}
                    <Text style={{fontSize: 16,
        color: (isDeadlineExpired && ref!=='completed' && ref!=='overdue')?'#fffff0':'black',}}>Deadline: <Text style={{ fontWeight: 'bold' ,color:(isDeadlineExpired && ref!=='completed' && ref!=='overdue')?'#fffff0':'black' }}>{moment(JSON.parse(item.deadline)).format('DD-MM-YYYY')}</Text></Text>
<View></View>
                    <View style={styles.footer}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: (isDeadlineExpired && ref!=='completed' && ref!=='overdue')?'black':'black',
                            backgroundColor: (this.color),
                            paddingLeft:5,
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            borderRadius: 20,
                        }}>{ref == 'active' ? 'active' : (ref === 'completed' ? 'completed' : 'overdue')}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )};
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0071b3', maxHeight: 'auto', paddingBottom: 80 }}>
            <View>               
                {/* filter code  */}
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={handleFilterPress}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 10 }}><Icon name="filter" size={30} color="white" /></Text>
                    </TouchableOpacity>
                    <Spinner
        visible={loading}
        textContent={"Loading ..."}
        textStyle={styles.spinnerText}
      />
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
                                        <ScrollView>
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
                                        {selectedRadio === 'createdby' && (
                                           
                                            <MultiSelect
                                                hideTags
                                                items={items}
                                                uniqueKey="id"
                                                flatListProps={{nestedScrollEnabled: true}}
                                                ref={(component) => { this.multiSelect = component }}
                                                onSelectedItemsChange={setselectedItemsFilter}
                                                selectedItems={selectedItemsFilter}
                                                selectText="Pick Items"
                                                searchInputPlaceholderText="Search Items..."
                                                onChangeInput={(text) => console.log(text)}
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
                                        </ScrollView>
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
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text>NO DATA AVAILABLE</Text>
                        </View>
                      )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: 
    {
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
    msgcount: {
        fontSize: 16,
        color: "white",
        fontWeight:'bold',
        backgroundColor:'green',
        textAlign:'center',
        fontFamily:'bold',
         borderRadius:15,
        borderColor:'green',
        borderWidth:5,
        borderTopRightRadius:5

    },
    content: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row'
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
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginLeft: '20%'
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
    }
   
});
