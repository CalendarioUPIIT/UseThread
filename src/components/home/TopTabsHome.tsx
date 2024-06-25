import { View, Text,Pressable } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs" 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Session } from '@supabase/supabase-js'
import CrearModeloScreen from '../../Formulario/CrearModeloForm';
import Feed from './Screens/Feed';
import Modelos from './Screens/Modelos';
import ImageToText from '../categorias/ImageToText';
import ImageToImage from '../categorias/ImageToImage';
import TextToImage from '../categorias/TextToImage';
import { useColorScheme } from 'nativewind'

const Tab = createMaterialTopTabNavigator()
const Stack = createNativeStackNavigator()

function CrearModeloWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <CrearModeloScreen key={session.user.id} session={session} />;
}
function FeedWrapper({ route }: { route: any }) {
  const { session } = route.params;

  return <Feed key={session.user.id} session={session} />;
}



function ModelosWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <Modelos key={session.user.id} session={session} />;
}
function ImageToTextWrapper({ route }: { route: any }) {
  const { session, modelo } = route.params; 
  return <ImageToText key={session.user.id} session={session} modelo={modelo}/>;
}
function ImageToImageWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <ImageToImage key={session.user.id} session={session} />;
}
function TextToImageWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <TextToImage key={session.user.id} session={session} />;
}

function StackNavigatorFeed({ route }: { route: any }) {
  const { session } = route.params;

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Principal" initialParams={{ session: session }} component={FeedWrapper} />
      <Stack.Screen name="Crear modelo" initialParams={{ session: session }} component={CrearModeloWrapper} />
    </Stack.Navigator>
  )
}

function StackNavigatorModelos({ route }: { route: any }) {
  const { session } = route.params;
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Principal" initialParams={{ session: session }} component={ModelosWrapper} />
      <Stack.Screen name="ImageToText" initialParams={{ session: session }} component={ImageToTextWrapper} />
      <Stack.Screen name="ImageToImage" initialParams={{ session: session }} component={ImageToImageWrapper} />
      <Stack.Screen name="TextToImage" initialParams={{ session: session }} component={TextToImageWrapper} />
    </Stack.Navigator>
  )
}



const TopTabsHome = ({ session }: { session: Session }) => {
  const {colorScheme, toggleColorScheme} = useColorScheme()
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        borderTopWidth: 0,
        paddingBottom: 5,
        backgroundColor: colorScheme === "dark" ? "#030712" : "#FFFFFF",
    },
    tabBarLabelStyle: {
      color: '#FFFFFF',
    },
    tabBarIndicatorStyle: {
      backgroundColor: '#6d28d9',
    },
    tabBarActiveTintColor: '#6d28d9',
    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)'
    }}>
        <Tab.Screen name="Feed" initialParams={{ session: session }} component={ StackNavigatorFeed }/>
        <Tab.Screen name="Modelos" initialParams={{ session: session }} component={ StackNavigatorModelos } />
    </Tab.Navigator>
  )
}

export default TopTabsHome