import { View, Text, Pressable, StyleSheet, useColorScheme, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../../../lib/supabase';

type Publicacion = {
  id: number;
  usuario: string;
  fecha: string;
  modelo: string;
  entrada: string;
  resultado: string;
};

const Feed = ({ session }: { session: Session }) => {
    const navigation = useNavigation(); 
    const [loading, setLoading] = useState(true);
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    
    useEffect(() => {
      if (session) getPublicaciones();
    }, [session]);

    async function getPublicaciones() {
      try {
        setLoading(true);
        if (!session?.user) throw new Error('No user on the session!');
  
        const { data, error, status } = await supabase
          .from('publicaciones')
          .select(`*`);
        if (error && status !== 406) {
          throw error;
        }
  
        setPublicaciones(data || []); 
  
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      }
    }

    const renderItem = ({ item }: { item: Publicacion }) => (
      <>
        <View className='border-2 mt-5'>
          {/* <Pressable onPress={() => TestModelo(item)}>
            <Text className='text-lg py-3 items-center'>Presiona para testear</Text>
          </Pressable> */}
          <Text>usuario: {item.usuario}</Text>
          <Text>Modelo: {item.modelo}</Text>
          <Text>Entrada: {item.entrada}</Text>
          <Text>Fecha: {item.fecha}</Text>
          <Text>resultado: {item.resultado}</Text>
        </View>
      </>
    );

    return (
      <>
      <View className='bg-white pl-5 pt-5 dark:bg-black dark:text-white'>
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
      
      <View className='pt-5 pb-36' >
        <View >
        {loading ? (
          <Text>Cargando...</Text>
        ) : (
          <> 
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <FlashList
              data={publicaciones}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              estimatedItemSize={200}
              />
          </ScrollView>
          </>
        )}
        
      </View>
      </View>


      </>

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