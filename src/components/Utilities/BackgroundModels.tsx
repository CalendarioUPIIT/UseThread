import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useColorScheme } from 'nativewind'

type ImageUri = string | null;
type ImageMime = string | null;

interface TakePhotoProps {
  onImageTaken: (uri: ImageUri) => void;
  onImageMime: (uri: ImageMime) => void;
}

const BackgroundModels: React.FC<TakePhotoProps> = ({ onImageTaken, onImageMime }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png');
  const [animationSource, setAnimationSource] = useState<any>(require('../../../assets/animations/Model.json'));
  const {colorScheme, toggleColorScheme} = useColorScheme()

  async function AbrirCamara(
    setModalVisible: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; },
    setImageUri: { (uri: string): void; } // parámetro para actualizar el estado de la imagen
  ) {
    setModalVisible(false);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      quality: 1,
      exif: false,
    });
  
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('User cancelled image picker.');
      setModalVisible(false); // Cierra el modal si el usuario cancela o no selecciona una imagen
      return;
    }

    const image = result.assets[0];

    if (!image.uri) {
      throw new Error('No image uri!');
    }
    if (!image.mimeType) {
      throw new Error('No image mimeType!');
    }
    setImageUri(image.uri); 
    onImageTaken(image.uri); 
    onImageMime(image.mimeType); 
  }
  
  async function AbrirArchivos(
    setModalVisible: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; },
    setImageUri: { (uri: string): void; } 
  ) {
    setModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,// Restrict to only images
      allowsMultipleSelection: false, // Can only select one image
      allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
      quality: 1,
      exif: false, // We don't want nor need that data.
    })
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('User cancelled image picker.')
      return
    }
    const image = result.assets[0]

    if (!image.uri) {
      throw new Error('No image uri!') 
    }
    if (!image.mimeType) {
      throw new Error('No image mimeType!');
    }
    setImageUri(image.uri); 
    onImageTaken(image.uri); 
    onImageMime(image.mimeType); 
  }

  const BorrarFoto = (
    setModalVisible: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; },
    setImageUri: { (uri: string): void; }
  ) => {
    setModalVisible(false);
    setImageUri('https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png');
    onImageTaken(null); 
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView} className='dark:bg-gray'>
            <View className='flex-row'>
              <Text className='font-poppins text-xl dark:text-whites' style={styles.modalText}>Toma tu imagen </Text>
              <Pressable
                  onPress={() => setModalVisible(!modalVisible)} className='items-center w-1/2 absolute left-32 h-full'>
                  <View>
                    <Ionicons name="close-circle-outline" color={colorScheme === "dark" ? "white": "black"} size={30} />
                  </View>
              </Pressable>
            </View>

            <View className='flex flex-row flex-wrap w-full items-center justify-between align-middle'>
              <Pressable
                onPress={() => AbrirCamara(setModalVisible, setImageUri)} className='items-center w-1/3 h-28 mb-7'>
                <View style={[styles.button, styles.buttonClose]}>
                  <Ionicons name="camera-outline" color={"black"} size={26} />
                </View>
                <Text className="font-poppins-bold dark:text-whites" style={styles.textStyle}>Tomar foto</Text>
              </Pressable>

              <Pressable
                onPress={() => AbrirArchivos(setModalVisible, setImageUri)} className='items-center w-1/3 h-28 mb-7'>
                <View style={[styles.button, styles.buttonClose]}>
                  <Ionicons name="arrow-up-outline" color={"black"} size={26} />
                </View>
                <Text className='dark:text-whites' style={styles.textStyle}>Cargar de archivos</Text>
              </Pressable>

              <Pressable
                onPress={() => BorrarFoto(setModalVisible, setImageUri)} className='items-center w-1/3 h-28 mb-7'>
                <View style={[styles.button, styles.buttonClose]}>
                  <Ionicons name="close-outline" color={"black"} size={26} />
                </View>
                <Text className='dark:text-whites' style={styles.textStyle}>Borrar foto</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="flex items-center justify-center"> 
          {!imageUri || imageUri === 'https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png' ? (
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Image 
              source={{ uri: imageUri }} 
              style={{ height: 200, width: 200, borderRadius: 30 }} 
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 100,
    padding: 20,
    elevation: 2,
    marginBottom: 10,
  },
  buttonOpen: {
    paddingTop: 10,
    backgroundColor: '#c7d2fe',
  },
  buttonClose: {
    backgroundColor: '#c7d2fe',
  },
  textStyle: {
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default BackgroundModels;