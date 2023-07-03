import { ScrollView, StatusBar } from "react-native";
import React, { useState ,useEffect} from "react";
import { useRoute } from '@react-navigation/native';

import { WebView } from 'react-native-webview';
// ...
export function Fileview() {
    const route = useRoute();
    const { filename , fileexten } = route.params;
    const [filepdf,setfilepdf] = useState(false);
    const Baseurl1 = "https://scrailway.co.in/webops/php/tma_bk1/uploads/"+filename;
    // console.log(filename);
    
   if(fileexten=='pdf' || fileexten=='PDF'){
    return (
     <WebView source={{ uri: `https://drive.google.com/viewerng/viewer?url=${Baseurl1}` }} style={{ flex: 1 }} /> 
      );
   } 
   else{
    return (
    
        <WebView source={{ uri: Baseurl1 }} style={{ flex: 1 }} /> 
      );
   }
   
}