import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind'

export default function TopBar() {
    const navigation = useNavigation();
    const { colorScheme, toggleColorScheme } = useColorScheme()

    return (
        <View className="flex-row items-center px-4 py-3 pl-3 pr-8">
            <Image
                source={colorScheme == 'dark' ? require('../../../../assets/logo_principal_dark.png') : require('../../../../assets/logo_principal_light.png')}
                style={{ width: 50, height: 50 }}
                className='mr-2'
            />
            <Text className="dark:text-whites font-bold ml-2 text-2xl">useThread</Text>
            <View style={{ flex: 1 }} />
            <Pressable 
                // @ts-ignore
                onPress={() => navigation.navigate('Editar perfil')}>
                <Ionicons name="menu-sharp" size={35} color={colorScheme == "dark" ? "white" : "black"}/>
            </Pressable>
        </View>
    );
}