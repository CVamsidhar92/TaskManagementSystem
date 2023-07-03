import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
export function TaskCard  ({ task, onEdit, onDelete, onComplete ,navigation })  {
  const { taskName, description, deadline, responsiblePerson, observerPerson,createdname, files } = task;

  return (
    <View style={{ padding: 5, margin: 10, backgroundColor: '#fffff0', borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 , color:'black' }}>TASK NAME: {taskName}</Text>
      <Text style={{ marginBottom: 5 ,color:'black'}}>Description: {description}</Text>
      <Text style={{ marginBottom: 5 ,color:'black'}}>Deadline: {deadline}</Text>
      <Text style={{ marginBottom: 5 ,color:'black'}}>Responsible Person: {responsiblePerson}</Text>
      {/* <Text style={{ marginBottom: 5 }}>Observer Person: {observerPerson}</Text> */}
      <Text style={{ marginBottom: 5 ,color:'black'}}>Observer Person: {observerPerson}</Text>
      <Text style={{ marginBottom: 5 ,color:'black'}}>Created By: {createdby}</Text>
      <Text style={{ marginBottom: 5 ,color:'black'}}>Designation: {createddesig}</Text>
      {files && files.length > 0 && (
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 , color:'black'}}>Files:</Text>
          {files.map((file, index) => (
            <TouchableOpacity key={index} onPress={() => {
              const fileext = file.file_name.slice((file.file_name.lastIndexOf(".") - 1 >>> 0) + 2);
            
              navigation.navigate('Fileview',{filename:file.file_name,fileexten:fileext})}}>
              <Text style={{ color: 'blue' }}>{file.file_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity style={{  padding: 10, borderRadius: 5 }} onPress={onEdit}>
          <Text><Icon name="edit" size={30} color="#002e52"  /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, borderRadius: 5 }} onPress={onDelete}>
          <Text><Icon name="window-close" size={30} color="#002e52"  /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 10, borderRadius: 5 }} onPress={onComplete}>
          <Text><Icon name="check-circle" size={30} color="#002e52"  /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

