import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";
import { useNavigation } from '@react-navigation/native';
import CrearModeloScreen from '../Formulario/CrearModeloForm';
import { Session } from '@supabase/supabase-js'


export default function HomeScreen({ session }: { session: Session }) {

  const navigation = useNavigation(); 

  return (
    <View className='flex-1 bg-white items-center justify-center '>
      <StatusBar style="auto" />
      <View >
        <Pressable 
            // @ts-ignore
            onPress={() => navigation.navigate('Crear modelo')}>
          <Text>Crear Modelo  </Text>
        </Pressable>
      </View>
    </View>
  );
}
