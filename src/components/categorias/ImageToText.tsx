import { ScrollView,View, Text, Button, Alert, Pressable, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";
import TakePhoto from '../Utilities/TakePhoto';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'nativewind'

type ImageUri = string | null;
type ImageMime = string | null;
const apiHF = process.env.EXPO_PUBLIC_API_HF;

async function fetchImageAndInfer(imageUri: ImageUri, modelo: string) {
  if (!imageUri) return null; 

  const hf = new HfInference(apiHF);
  const model = modelo;

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const result = await hf.imageToText({
      data: blob,
      model: model,
    });

    return result || null;
  } catch (error) {
    console.error("Error during image fetching and inference:", error);
    return null;
  }
}

const ImageToText =({ session, modelo, foto }: { session: Session; modelo: string; foto: string }) => {
    const navigation = useNavigation();
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const scrollViewRef = React.useRef<ScrollView>(null);
    const { height, width } = Dimensions.get('window');
    const { colorScheme } = useColorScheme();

    const imageHeight = height * 0.75;

    const [result, setResult] = useState<ImageToTextOutput | null>(null);
    const [isInferencing, setIsInferencing] = useState(false);

    const [loading, setLoading] = useState(false)

    const [imageUri, setImageUri] = useState<ImageUri>(null);
    const [mime, setMime] = useState<ImageMime>(null);

    const handleInferClick = () => {
      if (imageUri) {
        setIsInferencing(true); // Inicia la inferencia
        fetchImageAndInfer(imageUri, modelo).then((res) => {
          setResult(res);
          setIsInferencing(false); // Finaliza la inferencia
        });
      } else {
        setResult(null);
      }
    };

    async function Publish({
      modelo,
      imageUri,
      mime,
      result,
    }: {
      modelo: string
      imageUri: string | null 
      mime: string | null 
      result: ImageToTextOutput | null
    }) {
  
      try {
  
          setLoading(true)
  
          if (!imageUri) {
              throw new Error('No image uri!') 
          }
  
          const arraybuffer = await fetch(imageUri).then((res) => res.arrayBuffer())
  
          const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpeg'
          const path = `${Date.now()}${session?.user.id}.${fileExt}`
  
          const { data, error: uploadError } = await supabase.storage
          .from('publish')
          .upload(path, arraybuffer, {
          contentType: mime ?? 'image/jpeg',
          })
          if (uploadError) {
              console.log(uploadError)
          }
  
        if (!session?.user) throw new Error('No user on the session!')
  
          
        const { error } = await supabase
          .from('publicaciones')
          .insert({ 
              usuario: session?.user.id,
              fecha: new Date(),
              modelo: modelo,
              entrada: path,
              resultado: result?.generated_text,
              categoria: "ImageToText"
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

    useEffect(() => {
      if (foto) {
        downloadImage(foto);
      }
    }, [foto]);
  
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('background')
          .download(path);
  
        if (error) throw error;
  
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setBackgroundImage(fr.result as string);
        };
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  
    const scrollToContent = () => {
      scrollViewRef.current?.scrollTo({ y: height, animated: true });
    };

    const [hasPressed, setHasPressed] = useState(false);
    
  return (
    <ScrollView ref={scrollViewRef} className='dark:bg-black'>
    <View style={{ height: imageHeight }} className='h-full'>
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : require('../../../assets/bgnd.jpg')} // Asegúrate de tener una imagen de fondo
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View className='mb-0'>
            <Text className='ml-5 text-lg mt-4 dark:text-whites font-poppins text-start mb-6'>Estas probando el modelo:   
            </Text>
            <Text className='font-poppins-bold ml-5 dark:text-whites text-3xl'>{ modelo }</Text>
            
          </View>

          <Pressable 
            onPress={() => {
              setHasPressed(true);
              scrollToContent();
            }}
            className="bg-whites dark:bg-gray p-4 rounded-xl w-44 flex-row justify-between self-end mr-3 align-bottom absolute bottom-4 right-4"
          >
            <Text className='self-center text-lg font-poppins text-black dark:text-whites '>Probar modelo</Text>
            <Ionicons name={hasPressed ? "caret-down-circle-outline" : "caret-forward-circle-outline"} size={24} color={colorScheme === "dark" ? 'white' : 'black'} />
          </Pressable>
        </ImageBackground>
      </View>


    <View className='dark:bg-black h-full pt-40'>
      <Text className='h-32 text-start text-xl ml-5 mt-4 font-poppins dark:text-whites'>
        Categoria: Imagen a Texto
      </Text>

      <View className='-top-24'>
        <TakePhoto onImageTaken={setImageUri}  onImageMime={setMime} />
      </View>

      <View className='-top-20 items-center w-full pr-5 pl-5 mb-0 pb-0'>
      <Pressable 
        onPress={handleInferClick}
        disabled={!imageUri}
        className="flex-row justify-center p-3 w-36 bg-gray"
      >
        <Ionicons name="flask-outline" size={24} color={!imageUri ? 'gray' : 'white'} />
        <Text className={`font-poppins text-xl ml-2 ${!imageUri ? 'text-whites' : 'text-light-gray'}`}>Probar</Text>
      </Pressable>
           {isInferencing && <Text className='pt-5 pl-5 text-lg'>Generando...</Text>}
           {!isInferencing && result && (
          <>
            <Text className='pt-5 l-5 text-lg dark:text-whites font-poppins'> 
              Resultado: 
            </Text>  
            <Text className='px-10 text-xl w-full font-poppins border border-2-black pt-3 pb-3 dark:border-whites dark:text-whites'>
                {result.generated_text}
            </Text>

            <View className='w-full items-center'>
              <Pressable
                  className='w-2/5 -mt-3 bg-whites align-middle flex flex-row items-center p-3 dark:bg-gray'
                  disabled={loading} 
                  onPress={() => Publish({ modelo, imageUri, mime, result })} >
                    <Ionicons name="arrow-redo-outline" size={24} color={colorScheme === "dark" ? 'white' : 'black'} />
                    <Text className='text-xl font-poppins-bold text=center text-black dark:text-whites' > {loading ? 'Cargando ...' : 'Compartir'} </Text>
              </Pressable >
            </View>
          </>
          )}
      </View>


    </View>
    </ScrollView>
  )
}

export default ImageToText