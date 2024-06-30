import { View, Text, Pressable, StyleSheet,  Alert, ScrollView, Image, TouchableOpacity, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { useNavigation } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@rneui/themed';
import { useColorScheme } from 'nativewind'

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type Publicacion = {
  id: number;
  usuario: string;
  fecha: string;
  modelo: string;
  entrada: string;
  resultado: string;
  categoria: string;
  profiles: { 
    username: string; 
    avatar_url: string 
  };
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
    const {colorScheme, toggleColorScheme} = useColorScheme()


    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingModelos, setLoadingModelos] = useState(true);

    const [imagenes, setImagenes] = useState<{ [key: string]: string }>({});
    const [background, setBackground] = useState<{ [key: string]: string }>({});
    const [avatar, setAvatar] = useState<{ [key: string]: string }>({});
    
    const [imagenesCargadas, setImagenesCargadas] = useState(false);
    const [modelosCargados, setModelosCargados] = useState(false);

    
    useEffect(() => {
      if (session) {
        getPublicaciones();
        getModelos();
      }
      setBackground({});
      setImagenes({});

      setImagenesCargadas(false);
      setModelosCargados(false);
    }, [session]);

    async function getPublicaciones() {
      try {
        setLoading(true);
        setImagenesCargadas(false); // Restablecer al inicio de la carga
        if (!session?.user) throw new Error('No user on the session!');
    
        const { data, error, status } = await supabase
          .from('publicaciones')
          .select(`*, profiles(username, avatar_url)`)
          .order('fecha', { ascending: false });
        if (error && status !== 406) {
          throw error;
        }

    
        setPublicaciones(data || []);
    
        if (data) {
          // Esperar a que todas las imágenes sean descargadas antes de continuar
          await Promise.all(data.map(async (publicacion) => {
            if (publicacion.entrada) {
              await downloadImage(publicacion.entrada, publicacion.id.toString());
              await downloadAvatar(publicacion.profiles.avatar_url, publicacion.id.toString());
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
          throw error;
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
    async function downloadAvatar(path: string, publicacionId: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
    
        if (error) {
          throw error;
        }
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          // Actualizar el estado con la imagen correspondiente a la publicación
          setAvatar(prev => ({ ...prev, [publicacionId]: fr.result as string }));
        };
      } catch (error) {
        if (error instanceof Error) {
          console.log('Error: ', error.message);
        }
      }
    }


  async function getModelos() {
    try {
      setLoadingModelos(true);
      setModelosCargados(false); 
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('modelos')
        .select(`*`)
        .order('fecha', { ascending: false })
        .limit(5)


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
        setModelosCargados(true); // Marcar que todas las imágenes han sido cargadas
      }
      setLoadingModelos(false);

    } catch (error) {
      setLoadingModelos(false);
      setModelosCargados(false); // Asegurar que se restablezca si hay un error
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  async function downloadImageBackground(path: string, publicacionId: string) {
    try {
      const { data, error } = await supabase.storage.from('background').download(path);
  
      if (error) {
        throw error;
      }
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        // Actualizar el estado con la imagen correspondiente a la publicación
        setBackground(prev => ({ ...prev, [publicacionId]: fr.result as string }));
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error: ', error.message);
      }
    }
  }

  function TestModelo(item: Publicacion) {
    const categorias = ["ImageToText", "TextToImage", "ImageToImage"];

    if (categorias.includes(item.categoria)) {
      console.log(item.categoria);

    // @ts-ignore
      navigation.navigate(item.categoria, { modelo: item.modelo });
    }
  }
    const renderItemPublicacion = ({ item }: { item: Publicacion }) => (
      <>
        {imagenesCargadas && (
          <View className='mt-2 bg-whites dark:bg-gray pr-5 pl-5 pb-3 pt-3 rounded-2xl'>
            <View className='flex-row w-full'>
              <View className='flex-row w-full p-2 align-middle justify-between'>
                {avatar[item.id] && <Image source={{ uri: avatar[item.id] }} className='w-10 h-10 rounded-3xl self-start' />}

                <View className='flex-col self-start w-36'>
                  <Text className='text-black dark:text-whites font-poppins-bold text-lg'>{item.profiles.username}</Text>
                  <Text className='text-black dark:text-whites font-poppins-thin text-sm'>
                  {format(parseISO(item.fecha), "EEE, dd MMM, yyyy", { locale: es })}
                  </Text>
                  <Text className='text-black dark:text-whites font-poppins-bold'>{item.categoria}</Text>
                </View>

                <Pressable onPress={() => TestModelo(item)}>
                  <View className='justify-start align-top ml-3 self-end'>
                    <Ionicons name="play-forward-outline" size={30} color={colorScheme === "dark" ? "white" : "gray"}/>
                  </View> 
                </Pressable>
              </View>
            </View>

            <Text className='text-black dark:text-whites mb-2 mt-2 text-lg mr-2 ml-2 font-poppins-bold'>Entrada: </Text>
            {imagenes[item.id] && <Image source={{ uri: imagenes[item.id] }} style={styles.imagePost} />}
            <View className='w-full'>
              <View className='bg-soft-white dark:bg-black w-56 h-15 flex flex-row rounded-3xl pr-4 pl-4 pt-2 pb-2 align-middle justify-between -mt-6 self-center'>
                <View className='flex flex-col mr-3 align-middle justify-center items-center'>
                  <Ionicons name="heart-outline" size={25} color={colorScheme === "dark" ? "white" : "black"} className='self-center w-full'/>
                  <Text className='dark:text-whites text-center font-poppins'>10.2k likes</Text>
                </View>

                <View className='flex flex-col mr-3 align-middle justify-center items-center'>
                  <Ionicons name="play-forward-outline" size={25} color={colorScheme === "dark" ? "white" : "black"} className='self-center w-full'/>
                  <Text className='dark:text-whites font-poppins'>20.1k runs</Text>
                </View>

                <View className='flex flex-col mr-3 align-middle justify-center items-center'>
                  <Ionicons name="share-outline" size={25} color={colorScheme === "dark" ? "white" : "black"} className='self-center w-full'/>
                  <Text className='dark:text-whites font-poppins'>20.1k shares</Text>
                </View>
              </View>
            </View>

            <View className='flex-col align-middle w-full pr-5 pl-5 justify-center mt-6'>
              <Text className='dark:text-whites text-lg font-poppins-bold self-start'>Modelo: </Text>
              <Text className='text-black dark:text-whites font-poppins w-full'>{item.modelo}</Text>
              <Text className='dark:text-whites text-lg font-poppins-bold self-start'>Resultado: </Text>
              <Text className='text-black dark:text-whites w-full font-poppins'>{item.resultado}</Text>
            </View>
          </View>
        )}
      </>
    );

    const renderItemModelo = ({ item }: { item: Modelo }) => (
      <>
        {modelosCargados && (
          <View className='mt-0 ml-4'>
            {background[item.id] && <Image source={{ uri: background[item.id] }} style={styles.imageModel} />}
            <Text className='text-black dark:text-white hidden'>usuario: {item.usuario}</Text>
            <Text className='text-black dark:text-white hidden'>Modelo: {item.modelo}</Text>
            <Text className='text-black dark:text-white hidden'>Fecha: {item.fecha}</Text>
          </View>
        )}
      </>
    );

    const { top } = useSafeAreaInsets()

    const onRefresh = () => {
      getModelos();
      getPublicaciones();
    };

    return (
      <ScrollView className="dark:bg-black" refreshControl={ 
      <RefreshControl
        refreshing={loading && loadingModelos}
        onRefresh={onRefresh}
        progressViewOffset={top}
        colors={['#9Bd35A', '#689F38']}
        progressBackgroundColor="#fff"
        />}>
<View className='bg-white pl-5 pt-5 dark:bg-black pr-5'>
  {/* Contenedor principal para alinear elementos horizontalmente */}
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* Botón para subir modelo */}
    <View className='mb-9'>
      <Pressable 
          // @ts-ignore
          onPress={() => navigation.navigate('Crear modelo')}
          style={colorScheme === "dark" ? styles.addBtnOutside : styles.addBtnOutsideDark}>
        <View style={colorScheme === "dark" ? styles.addBtnInside : styles.addBtnInsideDark } className='flex items-center justify-center'>
          <Ionicons name="add-sharp" size={25} color={colorScheme === "dark" ? "white" : "black"} />
        </View>
        <Text className='text-black dark:text-whites text-center font-poppins text-sm'>Sube tu modelo</Text>
      </Pressable>
    </View>

    {/* Contenedor para la lista, ajustado para ocupar el espacio restante */}
    <View style={{ flex: 1 }}>
      {loadingModelos ? (
        <Text>Cargando...</Text>
      ) : (
        <ScrollView contentContainerStyle={{ flex: 1}}>
          <FlashList
            data={modelos}
            renderItem={renderItemModelo}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            estimatedItemSize={200}
          />
        </ScrollView>
      )} 
    </View>
  </View>
</View>
      
      <View className='pt-5 pb-5 mr-7 ml-7' >
        <View >
        {loading ? (
          <Text>Cargando...</Text>
        ) : (
          <> 
          <ScrollView contentContainerStyle={{ flex: 1 }}>
              <FlashList
              data={publicaciones}
              renderItem={renderItemPublicacion}
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
    imageModel: {
      width: 71,
      height: 110,
      padding: 0,
      borderRadius: 10,
    },
    imagePost: {
      width: 250,
      height: 250,
      borderRadius: 20,
      alignSelf: 'center',
      marginTop: 5,
    },
  })

export default Feed