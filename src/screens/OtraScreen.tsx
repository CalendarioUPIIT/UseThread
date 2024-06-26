import { View, Text } from 'react-native'
import React from 'react'
import { useColorScheme } from 'nativewind';

import Ionicons from '@expo/vector-icons/Ionicons'

export default function OtraScreen() {
  const {colorScheme, toggleColorScheme} = useColorScheme()
  return (
    <View className='flex flex-col bg-soft-whites text-black dark:bg-black dark:text-whites h-full w-full items-center p-14'>
      <Text className='dark:text-whites text-3xl text-center align-middle font-thin'>En proceso </Text>
      <Ionicons name="sync-sharp" size={25} color={colorScheme == "dark" ? "#fff" : "black"} className='self-center w-full'/>
    </View>
  )
}