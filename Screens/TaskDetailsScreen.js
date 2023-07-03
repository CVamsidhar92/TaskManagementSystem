import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskAllScreen from './TaskAllScreen';
import TaskCreatedByMe from './TaskCreatedByMe';
import TaskAssignedToMe from './TaskAssignedToMe';
import { useRoute } from '@react-navigation/native';


const Tab = createMaterialTopTabNavigator();

export default function TaskDetailsScreen() {
    const route = useRoute();
    const ref = route.params.ref;
    const id = route.params.id;
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator>
                <Tab.Screen name="All Tasks" component={TaskAllScreen}  initialParams={{ ref, id }} />
                <Tab.Screen name="Created By Me" component={TaskCreatedByMe} />
                <Tab.Screen name="Assigned To Me" component={TaskAssignedToMe} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

