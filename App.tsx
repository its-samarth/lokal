import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeScreen from './src/screens/HomeScreen'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './src/navigation/navigation';

const App = () => {
  return (
    <NavigationContainer>
    <MyStack/>
  </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})