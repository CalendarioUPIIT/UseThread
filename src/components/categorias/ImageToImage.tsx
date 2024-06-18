import { ScrollView,View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";

async function fetchImageAndInfer() {
    const apiHF = process.env.EXPO_PUBLIC_API_HF;
    
    const hf = new HfInference(apiHF)

    const imageURL = "https://hips.hearstapps.com/hmg-prod/images/small-dogs-6626cf74dfe17.jpg?crop=0.579xw:0.868xh;0.197xw,0.0337xh&resize=640:*"
    const model = "Salesforce/blip-image-captioning-large"
    const response = await fetch(imageURL)
    const blob = await response.blob()

    const result  = await hf.imageToText({
      data: blob,
      model: model
    })

    console.log(result)
    console.log(typeof result)

  return result || null;
}
const ImageToImage = () => {
    const [result, setResult] = useState<ImageToTextOutput | null>(null);
  
    useEffect(() => {
      fetchImageAndInfer().then((res) => {
        if (res !== null) {
          setResult(res);
        }
      });
    }, []);

    
  return (
    <View>
        <View className=' w-full h-auto justify-center items-center bg-black'>
            <Text className='text-white'>{result?.generated_text}</Text>
        </View>
    </View>
  )
}

export default ImageToImage