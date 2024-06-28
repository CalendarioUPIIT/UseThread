import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";
import { useNavigation } from '@react-navigation/native';
import CrearModeloScreen from '../Formulario/CrearModeloForm';
import { Session } from '@supabase/supabase-js'
import TabsHome from '../components/home/TopTabsHome';


export default function HomeScreen({ session }: { session: Session }) {
  return (
    <TabsHome.TopTabsHome key={session.user.id} session={session} />
  );
}
