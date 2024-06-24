import React from 'react';
import { View, Image, Text, useColorScheme, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function TopBar() {
    const navigation = useNavigation();

    return (
        <View className="flex-row items-center px-4 py-3 pt-10">
            <Image
                source={require('../../../../assets/logo.png')}
                style={{ width: 50, height: 50 }}
                className='mr-2'
            />
            <Text className="dark:text-white font-bold ml-2 text-2xl">useThread</Text>
            <View style={{ flex: 1 }} />
            <Pressable 
                // @ts-ignore
                onPress={() => navigation.navigate('Editar perfil')}>
                <Ionicons name="menu-sharp" size={35} color={useColorScheme() == "dark" ? "white" : "black"}/>
            </Pressable>
        </View>
    );
}