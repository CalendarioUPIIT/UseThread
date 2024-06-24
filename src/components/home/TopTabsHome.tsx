import { View, Text,Pressable } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs" 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Session } from '@supabase/supabase-js'
import CrearModeloScreen from '../../Formulario/CrearModeloForm';
import Feed from './Screens/Feed';
import Modelos from './Screens/Modelos';

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
      <Stack.Screen name="Crear modelo" initialParams={{ session: session }} component={CrearModeloWrapper} />
    </Stack.Navigator>
  )
}

const TopTabsHome = ({ session }: { session: Session }) => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        borderTopWidth: 0,
        paddingBottom: 5,
    },
    }}>
        <Tab.Screen name="Feed" initialParams={{ session: session }} component={ StackNavigatorFeed } />
        <Tab.Screen name="Modelos" initialParams={{ session: session }} component={ StackNavigatorModelos } />
    </Tab.Navigator>
  )
}

export default TopTabsHome