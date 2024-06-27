import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';

import Account from '../components/users/Account';
import Ionicons from '@expo/vector-icons/Ionicons'
import OtraScreen from '../screens/OtraScreen';
import { useColorScheme } from 'nativewind';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CrearModeloScreen from '../Formulario/CrearModeloForm2';
import EditProfileScreen from '../components/users/EditProfile';

const BottomTab = createBottomTabNavigator();   
const Stack = createNativeStackNavigator();   

function AccountWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <Account key={session.user.id} session={session} />;
}

function HomeWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <HomeScreen key={session.user.id} session={session} />;
}

function CrearModeloWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <CrearModeloScreen key={session.user.id} session={session} />;
}

function EditProfileWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <EditProfileScreen key={session.user.id} session={session} />;
}

function StackNavigator({ route }: { route: any }) {
  const { session } = route.params;
  const { colorScheme, toggleColorScheme } = useColorScheme()

  return (
    <Stack.Navigator 
    screenOptions={{
      headerTintColor: colorScheme == "dark" ? "white" : "black",
      headerStyle: { backgroundColor: colorScheme == "dark" ? "black" : "white" },
    }}>
      <Stack.Screen name="Principal" initialParams={{ session: session }} component={HomeWrapper} />
      <Stack.Screen name="Crear modelo" initialParams={{ session: session }} component={CrearModeloWrapper} />
      <Stack.Screen name="Editar perfil" initialParams={{ session: session }} component={EditProfileWrapper} />
    </Stack.Navigator>
  );
}

export const Navigator = ({ session }: { session: any }) => {

  const {colorScheme, toggleColorScheme} = useColorScheme()

  const darkmode = colorScheme === 'dark' ? 'white' : 'black'

  return (
    <BottomTab.Navigator initialRouteName="Home" screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: darkmode,
      tabBarInactiveTintColor: darkmode,
      tabBarStyle: {
        borderTopWidth: 0,
        paddingBottom: 5,
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    }}>
      
      <BottomTab.Screen 
          name="Home" 
          component={StackNavigator} 
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={26} />
            ),
          }} />

      <BottomTab.Screen 
          name="Practicas" 
          component={OtraScreen} 
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "documents" : "documents-outline"} color={color} size={26} />
            ),
          }} />

      <BottomTab.Screen 
          name="Perfil" 
          component={AccountWrapper} 
          initialParams={{ session: session }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} color={color} size={26} />
            ),
          }} />
    </BottomTab.Navigator>
  );
}