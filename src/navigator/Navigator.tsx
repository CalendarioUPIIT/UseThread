import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';

import Account from '../components/users/Account';
import Ionicons from '@expo/vector-icons/Ionicons'
import OtraScreen from '../screens/OtraScreen';
import { useColorScheme } from 'nativewind';

const BottomTab = createBottomTabNavigator();

function AccountWrapper({ route }: { route: any }) {
  const { session } = route.params;
  return <Account key={session.user.id} session={session} />;
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
          component={HomeScreen} 
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