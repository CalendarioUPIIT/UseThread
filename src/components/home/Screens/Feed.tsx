import { View, Text, Pressable, StyleSheet, useColorScheme, Alert, ScrollView, Image, TouchableOpacity, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@rneui/themed';

type Publicacion = {
  id: number;
  usuario: string;
  fecha: string;
  modelo: string;
  entrada: string;
  resultado: string;
};

type Modelo = {
  id: number;
  usuario: string;
  nombre: string;
  descripcion: string;
  modelo: string;
  fecha: string;
  categoria: string;
  foto: string;
};

const Feed = ({ session }: { session: Session }) => {
    const navigation = useNavigation(); 

  const [modelos, setModelos] = useState<Modelo[]>([]);

    
    const [loading, setLoading] = useState(true);
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});
    const [imagenesCargadas, setImagenesCargadas] = useState(false);

    
    useEffect(() => {
      if (session) getPublicaciones(), getModelos();
      // Restablecer el estado de carga de imágenes cuando la sesión cambie
      setImagenes({});
      setImagenesCargadas(false);
    }, [session]);

    async function getPublicaciones() {
      try {
        setLoading(true);
        setImagenesCargadas(false); // Restablecer al inicio de la carga
        if (!session?.user) throw new Error('No user on the session!');
    
        const { data, error, status } = await supabase
          .from('publicaciones')
          .select(`*`);
        if (error && status !== 406) {
          throw error;
        }
    
        setPublicaciones(data || []);
    
        if (data) {
          // Esperar a que todas las imágenes sean descargadas antes de continuar
          await Promise.all(data.map(async (publicacion) => {
            if (publicacion.entrada) {
              await downloadImage(publicacion.entrada, publicacion.id.toString());
            }
          }));
          setImagenesCargadas(true); // Marcar que todas las imágenes han sido cargadas
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setImagenesCargadas(false); // Asegurar que se restablezca si hay un error
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      }
    }
    
    async function downloadImage(path: string, publicacionId: string) {
      try {
        const { data, error } = await supabase.storage.from('publish').download(path);
    
        if (error) {
          throw error;top
        }
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          // Actualizar el estado con la imagen correspondiente a la publicación
          setImagenes(prev => ({ ...prev, [publicacionId]: fr.result as string }));
        };
      } catch (error) {
        if (error instanceof Error) {
          console.log('Error: ', error.message);
        }
      }
    }


  async function getModelos() {
    try {
      setLoading(true);
      setImagenesCargadas(false); 
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('modelos')
        .select(`*`)
        .order('fecha', { ascending: false })
        .limit(3)

      console.log(data);

      if (error && status !== 406) {
        throw error;
      }

      setModelos(data || []); 

      if (data) {
        // Esperar a que todas las imágenes sean descargadas antes de continuar
        await Promise.all(data.map(async (publicacion) => {
          if (publicacion.foto) {
            await downloadImageBackground(publicacion.foto, publicacion.id.toString());
          }
        }));
        setImagenesCargadas(true); // Marcar que todas las imágenes han sido cargadas
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setImagenesCargadas(false); // Asegurar que se restablezca si hay un error
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  async function downloadImageBackground(path: string, publicacionId: string) {
    try {
      const { data, error } = await supabase.storage.from('background').download(path);
  
      if (error) {
        throw error;top
      }
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        // Actualizar el estado con la imagen correspondiente a la publicación
        setImagenes(prev => ({ ...prev, [publicacionId]: fr.result as string }));
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error: ', error.message);
      }
    }
  }


    const renderItem = ({ item }: { item: Publicacion }) => (
      <>
        {imagenesCargadas && (
          <View className='border-2 mt-5'>
            <Text>usuario: {item.usuario}</Text>
            <Text>Modelo: {item.modelo}</Text>
            <Text>Entrada: {item.entrada}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>resultado: {item.resultado}</Text>
            {imagenes[item.id] && <Image source={{ uri: imagenes[item.id] }} style={{ width: 200, height: 200 }} />}
          </View>
        )}
      </>
    );

    const renderItemModelo = ({ item }: { item: Modelo }) => (
      <>
        {imagenesCargadas && (
          <View className='border-2 mt-5'>
            <Text>usuario: {item.usuario}</Text>
            <Text>Modelo: {item.modelo}</Text>
            <Text>Fecha: {item.fecha}</Text>
            {imagenes[item.id] && <Image source={{ uri: imagenes[item.id] }} style={{ width: 200, height: 200 }} />}
          </View>
        )}
      </>
    );

    const { top } = useSafeAreaInsets()

    const onRefresh = () => {
      getPublicaciones();
      getModelos();
    };

    return (
      <ScrollView refreshControl={ 
      <RefreshControl
        refreshing={loading}
        onRefresh={onRefresh}
        progressViewOffset={top}
        colors={['#9Bd35A', '#689F38']}
        progressBackgroundColor="#fff"
        />}>
<View className='bg-white pl-5 pt-5 dark:bg-black dark:text-white'>
  {/* Contenedor principal para alinear elementos horizontalmente */}
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* Botón para subir modelo */}
    <View>
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

    {/* Contenedor para la lista, ajustado para ocupar el espacio restante */}
    <View style={{ flex: 1 }}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <FlatList
            data={modelos}
            renderItem={renderItemModelo}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
          />
        </ScrollView>
      )} 
    </View>
  </View>
</View>
      



      <View className='pt-5 pb-5' >
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


      </ScrollView>

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