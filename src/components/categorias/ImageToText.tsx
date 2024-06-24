import { ScrollView,View, Text, Button, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";
import TakePhoto from '../Utilities/TakePhoto';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { useNavigation } from '@react-navigation/native';

type ImageUri = string | null;
type ImageMime = string | null;
const apiHF = process.env.EXPO_PUBLIC_API_HF;

async function fetchImageAndInfer(imageUri: ImageUri, modelo: string) {
  if (!imageUri) return null; 

  const hf = new HfInference(apiHF);
  const model = modelo;
  console.log("Modelo: ", model);

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const result = await hf.imageToText({
      data: blob,
      model: model,
    });

    console.log(result);
    console.log(typeof result);

    return result || null;
  } catch (error) {
    console.error("Error during image fetching and inference:", error);
    return null;
  }
}

const ImageToText =({ session, modelo }: { session: Session; modelo: string }) => {
  const navigation = useNavigation(); 


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
    <View className=''>
      <View>
        <Text className='text-center text-3xl mt-4'>Imagen a Texto</Text>
      </View>
      
      <View>
        <Text className='ml-5 text-lg mt-4'>Estas probando el modelo: 
        <Text className='font-bold'> { modelo }</Text>  
        </Text>
      </View>

      <View className='mt-28'>
        <TakePhoto onImageTaken={setImageUri}  onImageMime={setMime} />
      </View>
      <View className='mt-40'>
        <Button 
          title="Probar" 
          onPress={handleInferClick} 
          disabled={!imageUri}/>
           {isInferencing && <Text className='pt-5 pl-5 text-lg'>Generando...</Text>}
           {!isInferencing && result && (
          <>
            <Text className='pt-5 pl-5 text-lg'> 
              Resultado: 
            </Text>  
            <Text className='px-10 pt-5 text-xl'>
                {result.generated_text}
            </Text>

            <View className='mt-24'>
              <Pressable
                  className='w-11/12 h-10 items-center rounded-lg m-5'
                  disabled={loading} 
                  onPress={() => Publish({ modelo, imageUri, mime, result })} >
                  <Text className='text-xl' > {loading ? 'Cargando ...' : 'Publicar'} </Text>
              </Pressable >
            </View>
          </>
          )}
      </View>


    </View>
  )
}

export default ImageToText