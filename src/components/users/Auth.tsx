import React, { useState, useRef} from 'react'
import { Alert, StyleSheet, View, AppState, Image, Modal, Animated, TouchableWithoutFeedback, Keyboard, Text, Pressable} from 'react-native'
import { supabase } from '../../../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { useColorScheme } from 'nativewind'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { colorScheme, toggleColorScheme } = useColorScheme()

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const openModal = (signIn: boolean) => {
    setIsSignIn(signIn);
    setModalVisible(true);
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container} className="flex-1 dark:bg-black dark:text-whites text-black z-40">
      <Image
        source={colorScheme == 'dark' ? require('../../../assets/logo_dark.png') : require('../../../assets/logo_light.png')}
        style={styles.logo}
      />
      <View className='flex z-40 absolute w-full bottom-10 align-middle left-24'>
        <View style={[styles.verticallySpaced, styles.mt20]} >
          <Pressable onPress={() => openModal(true)} className='w-44 bg-transparent border-2 border-purple rounded-3xl h-12 items-center align-middle p-3'>
            <Text className='text-black dark:text-whites font-poppins text-lg'>Iniciar sesion</Text>
          </Pressable>
        </View>

        <View style={[styles.verticallySpaced, styles.mt20]} >
          <Pressable onPress={() => openModal(false)}  className='w-44 bg-purple rounded-3xl h-12 items-center align-middle p-3'>
            <Text className='text-whites font-poppins text-lg'>Registrar</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [
                      {
                        translateY: slideAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-300, 0],
                        }),
                      },
                    ],
                  },
                ]}
                className='h-96 bg-soft-white dark:bg-gray rounded-b-3xl'
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle} className='font-poppins text-black dark:text-whites text-3xl'>{isSignIn ? 'Bienvenid@ de nuevo' : 'Bienvenid@'}</Text>
                </View>
                <View className=' w-full rounded-xl mb-5'>
                  <Input
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize={'none'}
                    placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
                    style={{color: colorScheme === "dark" ? "white" : "black"}}
                  />
                </View>

                <View className='w-full rounded-xl mb-5'>
                  <Input
                    underlineColorAndroid="transparent"
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
                    style={{color: colorScheme === "dark" ? "white" : "black"}}
                  />
                </View>

                <View className='self-end'>
                  <Pressable onPress={isSignIn ? signInWithEmail : signUpWithEmail} className='w-32 bg-purple rounded-3xl h-12 items-center p-3'>
                    <Text className='text-whites font-poppins text-base'>{isSignIn ? 'Iniciar sesion' : 'Registrar'}</Text>
                  </Pressable>
                </View>

              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View className='z-30 rounded-full right-0 -bottom-52 bg-soft-white dark:bg-black absolute' style={{height: 390, width: 390}}></View>
      <View className=' z-20 rounded-full -right-14 -bottom-56 bg-purple opacity-30 absolute' style={{height: 500, width: 500}}></View>
      <View className=' z-10 rounded-full -right-14 -bottom-32 bg-purple opacity-10 absolute' style={{height: 500, width: 500}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 5,
    marginBottom: 0,
  },
  logo: {
    width: 170,
    height: 170,
    alignSelf: 'center',
  },
  label: {
    fontSize: 28,
  },
  inputlight: {
    color: 'black'
  },
  inputdark: {
    color: '#ffffff'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
  },
  modalHeader: {
    width: '100%',
    padding: 15,
  },
  modalTitle: {
  },
})