import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker'

type ImageUri = string | null;
type ImageMime = string | null;

interface TakePhotoProps {
  onImageTaken: (uri: ImageUri) => void;
  onImageMime: (uri: ImageMime) => void;
}

const TakePhoto: React.FC<TakePhotoProps> = ({ onImageTaken, onImageMime }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState('https://i.pinimg.com/originals/9b/8b/bf/9b8bbfb45ebb5d4e2e429e3048d757f9.jpg');

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
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Toma tu imagen </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cerrar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => AbrirCamara(setModalVisible, setImageUri)}>
              <Text style={styles.textStyle}>Tomar foto</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => AbrirArchivos(setModalVisible, setImageUri)}>
              <Text style={styles.textStyle}>Cargar de archivos</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => BorrarFoto(setModalVisible, setImageUri)}>
              <Text style={styles.textStyle}>Borrar foto</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="flex items-center justify-center"> 
        <Image source={{ uri: imageUri }} style={{ height: 200, width: 200, borderRadius: 30 }} />
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
    backgroundColor: 'white',
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    paddingTop: 10,
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default TakePhoto;