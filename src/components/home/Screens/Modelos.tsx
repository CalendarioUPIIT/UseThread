import { View, Text, Alert, FlatList, Image, ScrollView, Pressable, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../../../lib/supabase'
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColorScheme } from 'nativewind'
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

const Modelos = ({ session }: { session: Session })  => {
  const navigation = useNavigation(); 

  const [loading, setLoading] = useState(true);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});
  const [imagenesCargadas, setImagenesCargadas] = useState(false);


  useEffect(() => {
    if (session) getModelos();

    setImagenes({});
    setImagenesCargadas(false);
  }, [session]);

  async function getModelos() {
    try {
      setLoading(true);
      setImagenesCargadas(false); 
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('modelos')
        .select(`*`);
      if (error && status !== 406) {
        throw error;
      }

      setModelos(data || []); 

      if (data) {
        // Esperar a que todas las imágenes sean descargadas antes de continuar
        await Promise.all(data.map(async (publicacion) => {
          if (publicacion.foto) {
            await downloadImage(publicacion.foto, publicacion.id.toString());
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

  function TestModelo(item: Modelo) {
    const categorias = ["ImageToText", "TextToImage", "ImageToImage"];
    if (categorias.includes(item.categoria)) {
    // @ts-ignore
      navigation.navigate(item.categoria, { 
        modelo: item.modelo, 
        foto: item.foto
      });
    }
  }

  const {colorScheme, toggleColorScheme} = useColorScheme()

  const renderItem = ({ item }: { item: Modelo }) => (
    <>
    {imagenesCargadas && (
      <View className='mb-3 pt-3 pb-3 pr-8 pl-8 max-w-screen-sm flex-row'>
        {imagenes[item.id] && <Image className='mr-5' source={{ uri: imagenes[item.id] }} style={{ width: 150, height: 150 }} />}
        <View className='flex-col w-48 pr-4'>
          <View className='flex flex-row justify-between items-center w-full'>
            <Text className='text-black dark:text-whites text-2xl font-bold'>{item.nombre}</Text>
            <Pressable className='flex flex-row p-2' onPress={() => TestModelo(item)}>
              <Ionicons name="play-forward-outline" size={25} color={colorScheme === "dark" ? "white" : "black"}/>
            </Pressable>
          </View>

          <Text className='text-black dark:text-whites'>Modelo: {item.modelo}</Text>
          <Text className='text-black dark:text-whites'>{item.descripcion}</Text>
          <Text className='text-black dark:text-whites font-thin'>
          {format(parseISO(item.fecha), "EEE, dd MMM, yyyy", { locale: es })}
          </Text>
          <Text className='text-black dark:text-whites'>Categoria: {item.categoria}</Text>
        </View>
      </View>
     )}
    </>
  );
  const { top } = useSafeAreaInsets()

  return (
    <ScrollView className="dark:bg-black text-black" refreshControl={ 
      <RefreshControl
        refreshing={loading}
        onRefresh={getModelos}
        progressViewOffset={top}
        colors={['#9Bd35A', '#689F38']}
        progressBackgroundColor="#fff"
        />}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <> 
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <FlashList
            data={modelos}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            estimatedItemSize={200}
            />
        </ScrollView>
        </>
      )}
      
    </ScrollView>
  );

}

export default Modelos