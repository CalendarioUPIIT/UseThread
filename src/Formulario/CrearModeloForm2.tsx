import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Alert, ViewBase } from 'react-native'
import React, { useState, useRef } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import BackgroundModels from '../components/Utilities/BackgroundModels';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind'
import LottieView from 'lottie-react-native';

type ImageUri = string | null;
type ImageMime = string | null;

const CATEGORIAS = [
  {
      id: 1,
      nombre: 'Imagen a Texto',
      icono: (color: string) => <MaterialCommunityIcons name="image-edit-outline" size={40} color={color} />,
      component: "ImageToText",
  },
  {
      id: 2,
      nombre: 'Clasificación de Imagenes',
      icono: (color: string) => <MaterialCommunityIcons name="image-text" size={40} color={color} />,
      component: "TextToImage",
  },
  {
      id: 3,
      nombre: 'Otra categoría',
      icono: (color: string) => <MaterialCommunityIcons name="image-multiple-outline" size={40} color={color} />,
      component: "ImageToImage",
  },
];

const CrearModeloScreen = ({ session }: { session: Session }) => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [background, setBackground] = useState<ImageUri>(null);
    const [mime, setMime] = useState<ImageMime>(null);
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [modelo, setModelo] = useState('')

    const {colorScheme, toggleColorScheme} = useColorScheme()

    const steps = [
        { title: 'Categoría', field: 'categoria' },
        { title: '¿Cuál es el nombre de tu modelo?', field: 'nombre' },
        { title: 'Introduce una ruta de HuggingFace', field: 'modelo' },
        { title: 'Escribe una descripción de tu modelo', field: 'descripcion' },
        { title: 'Elige un Background para tu modelo', field: 'background' },
    ];

    async function createModel({
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

    const animationRef = useRef(null);

    return (
        <View className="flex-1 justify-center items-center border-spacing-20 overflow-hidden bg-soft-white dark:bg-black">
        <ScrollView 
            className="w-full"
            contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            }}>
            
            
            <View className='h-40 w-40 z-10 rounded-full left-72 -top-28 border-2 border-purple absolute bg-purple2 opacity-40'></View>
            <View className='h-40 w-40 z-10 rounded-full left-52 -top-32 border-2 border-purple absolute'></View>


            <View className=' dark:bg-black dark:text-whites align-middle justify-center pt-20 pb-14 w-full'>
                {currentStep === 0 && (
                  <View>
                    <Text className='dark:text-whites text-4xl w-full text-center font-poppins-bold'> Elige la categoria </Text>
                    <Text className='dark:text-whites text-xl w-full text-center mt-8 font-poppins-thin'> Selecciona la que mejor describe a tu modelo </Text>
                    <ScrollView 
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 10 }}
                      className="w-full mt-10"
                    >
                      {CATEGORIAS.map((categoria) => (
                        <TouchableOpacity
                            key={categoria.id}
                            onPress={() => {
                                setSelectedComponent(categoria.component);
                                setCurrentStep(1);
                            }}
                            className={`flex flex-col items-center justify-center w-28 mr-3 h-40 rounded-lg mt-2 border border-solid border-black dark:border-whites ${
                                colorScheme === 'dark' ? 'bg-black' : 'bg-transparent'
                            } justify-between pt-8 pb-8`}
                        >
                            {categoria.icono(colorScheme === 'dark' ? 'white' : 'black')}
                            <Text className={`text-lg font-thin self-center text-center font-poppins ${
                                colorScheme === 'dark' ? 'text-whites' : 'text-black'
                            }`}>
                                {categoria.nombre}
                            </Text>
                          </TouchableOpacity>
                        ))
                      }
                    </ScrollView>
                  </View>
                )}

                {currentStep > 0 && currentStep < steps.length && (
                    <View className='flex flex-col w-full justify-between h-full pl-5 pr-5'>
                        <Text className='text-4xl self-center text-center text-black dark:text-whites mb-6 font-poppins'>{steps[currentStep].title}  </Text>
                        {steps[currentStep].field === 'descripcion' ? (
                            <TextInput
                                multiline={true}
                                numberOfLines={6}
                                maxLength={200}
                                onChangeText={(text) => setDescripcion(text)}
                                className='w-80 h-15 bg-gray-200 rounded-lg mb-16 text-black border-b-2 border-gray dark:text-whites dark:border-soft-whites font-poppins'
                                placeholder={`Descripcion: `}
                                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                                style={{ fontSize: 24 }}
                            />
                        ) : steps[currentStep].field === 'background' ? (
                            <BackgroundModels onImageTaken={setBackground} onImageMime={setMime} />
                        )  : steps[currentStep].field === 'nombre' ? (
                          <TextInput
                              onChangeText={(text) => { setNombre(text);}}
                              className='w-80 h-15 rounded-lg p-3 ml-5 mr-5 mb-16 text-black border-b-2 border-gray dark:text-whites dark:border-soft-whites font-poppins'
                              placeholder={`Nombre del modelo:`}
                              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                              style={{ fontSize: 24 }}
                          />
                        )  : (
                          <TextInput
                          onChangeText={(text) => { setModelo(text);}}
                          className='w-80 h-15 rounded-lg mb-16 text-black border-b-2 border-gray dark:text-whites dark:border-soft-whites font-poppins'
                          placeholder={`Ruta de Hugging Face`}
                          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                          style={{ fontSize: 24 }}
                      />
                        )}

                    {currentStep === steps.length - 1 && (
                    <>
                        <Pressable
                            className={`flex-1 items-center justify-center self-center w-44 h-14 rounded-lg${
                                loading || !nombre || !descripcion || !modelo || !selectedComponent || !background
                                    ? 'bg-gray'
                                    : 'bg-purple'
                            }`}
                            disabled={loading || !nombre || !descripcion || !modelo || !selectedComponent || !background}
                            onPress={() => {
                                if (!nombre || !descripcion || !modelo || !selectedComponent || !background) {
                                    Alert.alert('Error', 'Por favor, complete todos los campos antes de publicar.');
                                } else {
                                  createModel({ nombre, descripcion, modelo, selectedComponent, background, mime})
                                }
                            }}
                        >
                            <Text className={`pt-3 text-center text-xl text-whites self-center w-32 h-12 rounded-3xl font-poppins ${
                                loading || !nombre || !descripcion || !modelo || !selectedComponent || !background
                                    ? 'bg-gray'
                                    : 'bg-purple'
                            }`}>{loading ? 'Cargando ...' : 'Publicar'}</Text>
                        </Pressable>
                    </>
                )}

                        <View className='flex-row justify-between'>
                            {currentStep > 1 && (
                                <TouchableOpacity onPress={() => setCurrentStep(currentStep - 1)}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                      <LottieView
                                        ref={animationRef}
                                        source={require('../../assets/animations/Next.json')}
                                        style={{ width: 100, height: 100, transform: [{ scaleX: -1 }]}}
                                        autoPlay
                                        loop
                                      />
                                    </View>
                                    <Text className='text-center w-full text-xl text-black dark:text-whites font-poppins'>Anterior</Text>
                                </TouchableOpacity>
                            )}
                            {currentStep < steps.length - 1 && (
                                <TouchableOpacity onPress={() => setCurrentStep(currentStep + 1)} className='w-full align-center justify-center'>
                                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                      <LottieView
                                        ref={animationRef}
                                        source={require('../../assets/animations/Next.json')}
                                        style={{ width: 100, height: 100 }}
                                        autoPlay
                                        loop
                                      />
                                    </View>
                                    <Text className='text-center w-full text-xl text-black dark:text-whites font-poppins'>Siguiente</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </View>

            <View className='h-40 w-40 z-10 rounded-full right-72 -bottom-28 border-2 border-purple bg-purple2 opacity-40 absolute'></View>
            <View className='h-40 w-40 z-10 rounded-full right-52 -bottom-36 border-2 border-purple absolute'></View>

        </ScrollView>
        </View>
    );
};

export default CrearModeloScreen;