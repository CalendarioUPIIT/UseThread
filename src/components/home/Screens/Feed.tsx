import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Feed = ({ session }: { session: Session }) => {
    const navigation = useNavigation(); 

    return (
      <View className='flex-1 bg-white items-center justify-center dark:bg-black dark:text-white'>
        <View >
          <Pressable 
              // @ts-ignore
              onPress={() => navigation.navigate('Crear modelo')}
              style={useColorScheme() == "dark" ? styles.addBtnOutsideDark : styles.addBtnOutside}>
            <View style={useColorScheme() == "dark" ? styles.addBtnInsideDark : styles.addBtnInside } className='flex items-center justify-center'>
              <Ionicons name="add-sharp" size={25} color={useColorScheme() == "dark" ? "black" : "white"} />
            </View>
            <Text className='text-black dark:text-white text-center'>Sube tu modelo</Text>
          </Pressable>
        </View>
      </View>
    )
  }


  const styles = StyleSheet.create({
    addBtnOutside: {
      width: 80,
      height: 110,
      borderRadius: 10,
      borderColor: 'white',
      borderStyle: 'dotted',
      borderWidth: 3,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    addBtnOutsideDark: {
      width: 80,
      height: 110,
      borderRadius: 10,
      borderColor: 'black',
      borderStyle: 'dotted',
      borderWidth: 3,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    addBtnInside: {
      width: 40,
      height: 40,
      borderRadius: 10,
      borderColor: 'white',
      borderStyle: 'dotted',
      borderWidth: 3,
      marginBottom: 10
    },
    addBtnInsideDark: {
      width: 40,
      height: 40,
      borderRadius: 10,
      borderColor: 'black',
      borderStyle: 'dotted',
      borderWidth: 3,
      marginBottom: 10
    },
  })

export default Feed