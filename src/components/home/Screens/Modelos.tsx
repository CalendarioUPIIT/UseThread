import { View, Text, Alert, FlatList, Dimensions, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../../../lib/supabase'
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

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
  const [loading, setLoading] = useState(true);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    if (session) getModelos();
  }, [session]);

  async function getModelos() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('modelos')
        .select(`*`);
      if (error && status !== 406) {
        throw error;
      }

      setModelos(data || []); 

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        Alert.alert(error.message);
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
      <View className='border-2 mt-5'>
        <Pressable onPress={() => TestModelo(item)}>
          <Text className='text-lg py-3 items-center'>Presiona para testear</Text>
        </Pressable>
        <Text>Nombre: {item.nombre}</Text>
        <Text>Modelo: {item.modelo}</Text>
        <Text>Descripción: {item.descripcion}</Text>
        <Text>Fecha: {item.fecha}</Text>
        <Text>Categoria: {item.categoria}</Text>
        <Text>foto: {item.foto}</Text>
      </View>
    </>
  );

  return (
    <View >
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
      
    </View>
  );

}

export default Modelos