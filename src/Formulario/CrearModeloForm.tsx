import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageToText from '../components/categorias/ImageToText';
import TextToImage from '../components/categorias/TextToImage';
import ImageToImage from '../components/categorias/ImageToImage';
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import BackgroundModels from '../components/Utilities/BackgroundModels';
import { useNavigation } from '@react-navigation/native';

type ImageUri = string | null;
type ImageMime = string | null;

const CATEGORIAS = [
    {
        id: 1,
        nombre: 'Image To Text',
        icono: <MaterialCommunityIcons name="image-edit-outline" size={24} color="black" />,
        component: "ImageToText",
    },
    {
        id: 2,
        nombre: 'Text To Image',
        icono: <MaterialCommunityIcons name="image-text" size={24} color="black" />,
        component: "TextToImage",
    },
    {
        id: 3,
        nombre: 'Image To Image',
        icono: <MaterialCommunityIcons name="image-multiple-outline" size={24} color="black" />,
        component: "ImageToImage",
    },
];

const CrearModeloScreen = ({ session }: { session: Session }) => {

    const navigation = useNavigation(); 
    
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    const [background, setBackground] = useState<ImageUri>(null);
    const [mime, setMime] = useState<ImageMime>(null);


    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [modelo, setModelo] = useState('')

    const componentMapping: { [key: string]: JSX.Element } = {
        ImageToText: <ImageToText />,
        TextToImage: <TextToImage />,
        ImageToImage: <ImageToImage />,
    };

  async function updateModel({
    nombre,
    descripcion,
    modelo,
    selectedComponent,
    background,
    mime
  }: {
    nombre: string
    descripcion: string
    modelo: string
    selectedComponent: string
    background: string | null 
    mime: string | null 
  }) {

    try {

        setLoading(true)

        if (!background) {
            throw new Error('No image uri!') 
        }

        const arraybuffer = await fetch(background).then((res) => res.arrayBuffer())

        const fileExt = background.split('.').pop()?.toLowerCase() ?? 'jpeg'
        const path = `${Date.now()}${session?.user.id}.${fileExt}`

        const { data, error: uploadError } = await supabase.storage
        .from('background')
        .upload(path, arraybuffer, {
        contentType: mime ?? 'image/jpeg',
        })
        if (uploadError) {
            console.log(uploadError)
        }

      if (!session?.user) throw new Error('No user on the session!')

        
      const { error } = await supabase
        .from('modelos')
        .insert({ 
            usuario: session?.user.id,
            nombre: nombre,
            descripcion: descripcion,
            modelo: modelo,
            categoria: selectedComponent,
            fecha: new Date(),
            foto: path
        })
    
        console.log(error)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {

      setLoading(false)
      navigation.goBack()
    }
  }


    return (
        <ScrollView>
        <View >
            {CATEGORIAS.map((categoria) => (
                <TouchableOpacity
                    key={categoria.id}
                    onPress={() => setSelectedComponent(categoria.component)}
                    className='flex flex-row items-center justify-center w-full h-10 bg-gray-200 rounded-lg mt-2'
                >
                    {categoria.icono}
                    <Text className='ml-5'>{categoria.nombre}</Text>
                </TouchableOpacity>
            ))}
            <View className='mt-5'>
            {selectedComponent && (
                <>
                    <Text className='ml-3'>Nombre:</Text>
                        <TextInput
                            className='w-11/12 h-10 bg-gray-200 rounded-lg p-2 ml-5 mr-5'
                            onChangeText={(nombre: string) => setNombre(nombre)}
                            placeholder="Nombre del modelo" />

                    <Text className=' mt-5 ml-3'>Ruta Hugging Face:</Text>
                        <TextInput
                          onChangeText={(modelo: string) => setModelo(modelo)}
                            className='w-11/12 h-10 bg-gray-200 rounded-lg p-2 ml-5 mr-5'
                            placeholder="Modelo en Hugging Face" />

                    <Text className=' mt-5 ml-3'>Descripcion:</Text>
                        <TextInput
                          multiline={true}
                          numberOfLines={6} 
                          maxLength={200}
                          onChangeText={(descripcion: string) => setDescripcion(descripcion)}
                            className='w-11/12 h-auto bg-gray-200 rounded-lg p-2 ml-5 mr-5'
                            placeholder="Descripcion del modelo " />

                    <Text className=' mt-5 ml-3'>Elige un background para tu modelo:</Text>

                    <BackgroundModels onImageTaken={setBackground} onImageMime={setMime}/>


                    <Text className=' mt-5 ml-3'>Test:</Text>

                    {componentMapping[selectedComponent]}

                    <Pressable
                        className='flex-1 items-center justify-center w-11/12 h-10 bg-slate-300 rounded-lg m-5'
                        disabled={loading} 
                        onPress={() => updateModel({ nombre, descripcion, modelo, selectedComponent, background, mime})} >
                        <Text > {loading ? 'Cargando ...' : 'Publicar'} </Text>
                    </Pressable >

                </>
            )}
            </View>
        </View>

        </ScrollView>
    );
};



export default CrearModeloScreen;