import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatScreen from './ChatScreen';
import { ListUsers } from './ListUsers';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import SettingsScreen from './SettingsScreen';
import useAuthentication from './useAuthentication';
import { Ionicons } from '@expo/vector-icons'; // You can choose other icon sets as well

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const {user} = useAuthentication();

  
  if (user){
    return (
      <NavigationContainer>
      <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'ChatScreen') {
                  iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'ListUsers') {
                  iconName = focused ? 'people' : 'people-outline';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'blue',
              tabBarInactiveTintColor: 'gray',
            })}
          >
          <Tab.Screen name="ListUsers" component={ListUsers} />
          <Tab.Screen name="ChatScreen" component={ChatScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
      </NavigationContainer>  
    );  
  }
}

