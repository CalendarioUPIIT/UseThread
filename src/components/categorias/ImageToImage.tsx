import { ScrollView,View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";
import TakePhoto from '../Utilities/TakePhoto';

type ImageUri = string | null;
const apiHF = process.env.EXPO_PUBLIC_API_HF;

async function fetchImageAndInfer(imageUri: ImageUri) {
  if (!imageUri) return null; 

  const hf = new HfInference(apiHF);
  const model = "Salesforce/blip-image-captioning-large";

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

const ImageToImage = () => {
    const [result, setResult] = useState<ImageToTextOutput | null>(null);
    const [imageUri, setImageUri] = useState<ImageUri>(null);

    const handleInferClick = () => {
      if (imageUri) {
          fetchImageAndInfer(imageUri).then((res) => {
              setResult(res); // Asume que res es del tipo correcto
          });
      } else {
          setResult(null);
      }
  };

  return (
    <View>
      <View className='w-full h-auto justify-center items-center'>
        <TakePhoto onImageTaken={setImageUri} />
      </View>
      <View>
            <Button title="Infer" onPress={handleInferClick} disabled={!imageUri}  />
            {result && 
              <Text className='pl-3'>{result.generated_text}</Text>
            }
        </View>

    </View>
  )
}

export default ImageToImage