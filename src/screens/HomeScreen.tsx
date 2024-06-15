import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HfInference } from "@huggingface/inference"
import { ImageToTextOutput } from "@huggingface/inference";

async function fetchImageAndInfer() {
        const hf = new HfInference("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")

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
      // Asegúrate de que esta función devuelva un valor o null
      return result || null;
}

export default function HomeScreen() {
  const [result, setResult] = useState<ImageToTextOutput | null>(null);

  useEffect(() => {
    fetchImageAndInfer().then((res) => {
      if (res !== null) {
        setResult(res);
      }
    });
  }, []);

  return (
    <View className='flex-1 bg-white items-center justify-center '>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>{result ? JSON.stringify(result, null, 2) : 'Loading...'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});