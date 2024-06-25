import { View, Text, Alert, FlatList, Image, ScrollView, Pressable, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../../../lib/supabase'
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    navigation.navigate(item.categoria, { modelo: item.modelo });
    }
  }

  const renderItem = ({ item }: { item: Modelo }) => (
    <>
    {imagenesCargadas && (
      <View className='border-2 mt-5 ml-2'>
        <Pressable onPress={() => TestModelo(item)}>
          <Text className='text-lg py-3 items-center'>Presiona para testear</Text>
        </Pressable>
        <Text>Nombre: {item.nombre}</Text>
        <Text>Modelo: {item.modelo}</Text>
        <Text>Descripción: {item.descripcion}</Text>
        <Text>Fecha: {item.fecha}</Text>
        <Text>Categoria: {item.categoria}</Text>
        <Text>foto: {item.foto}</Text>
        {imagenes[item.id] && <Image source={{ uri: imagenes[item.id] }} style={{ width: 200, height: 200 }} />}
      </View>
     )}
    </>
  );
  const { top } = useSafeAreaInsets()

  return (
    <ScrollView refreshControl={ 
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