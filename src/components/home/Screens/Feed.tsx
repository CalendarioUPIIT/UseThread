import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';

const Feed = ({ session }: { session: Session }) => {
    const navigation = useNavigation(); 

    return (
      <View>
        <View >
          <Pressable 
              // @ts-ignore
              onPress={() => navigation.navigate('Crear modelo')}>
            <Text>Crear Modelo  </Text>
          </Pressable>
        </View>
      </View>
    )
  }

export default Feed