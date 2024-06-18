import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";
import { useNavigation } from '@react-navigation/native';
import CrearModeloScreen from './CrearModeloScreen';


export default function HomeScreen() {

  const navigation = useNavigation(); 

  return (
    <View className='flex-1 bg-white items-center justify-center '>
      <StatusBar style="auto" />
      <View >
        <Pressable 
          onPress={() => navigation.navigate('Crear modelo')}>
          <Text>Crear Modelo  </Text>
        </Pressable>
      </View>
    </View>
  );
}
