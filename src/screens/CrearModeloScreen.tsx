import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageToText from '../components/categorias/ImageToText';
import TextToImage from '../components/categorias/TextToImage';
import ImageToImage from '../components/categorias/ImageToImage';

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

const CrearModeloScreen = () => {
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

    const componentMapping: { [key: string]: JSX.Element } = {
        ImageToText: <ImageToText />,
        TextToImage: <TextToImage />,
        ImageToImage: <ImageToImage />,
    };

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
                            placeholder="Nombre del modelo" />

                    <Text className=' mt-5 ml-3'>Ruta Hugging Face:</Text>
                        <TextInput
                            className='w-11/12 h-10 bg-gray-200 rounded-lg p-2 ml-5 mr-5'
                            placeholder="Modelo en Hugging Face" />

                    <Text className=' mt-5 ml-3'>Descripcion:</Text>
                        <TextInput
                          multiline={true}
                          numberOfLines={6} 
                          maxLength={200} 

                            className='w-11/12 h-auto bg-gray-200 rounded-lg p-2 ml-5 mr-5'
                            placeholder="Descripcion del modelo " />

                    <Text className=' mt-5 ml-3'>Test:</Text>

                    {componentMapping[selectedComponent]}
                </>
            )}
            </View>
        </View>
        </ScrollView>
    );
};



export default CrearModeloScreen;