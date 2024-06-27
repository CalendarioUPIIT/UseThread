import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Image} from 'react-native'
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

  return (
    <View style={styles.container} className="flex-1 dark:bg-black dark:text-whites text-black">
      <Image
        source={colorScheme == 'dark' ? require('../../../assets/logo_dark.png') : require('../../../assets/logo_light.png')}
        style={styles.logo}
      />
      <View style={[styles.verticallySpaced, styles.mt20]} className="dark; text-white">
        <Input
          label="Email"
          labelStyle={styles.label}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor={colorScheme == 'dark' ? 'soft-whites': 'gray'}
          autoCapitalize={'none'}
          style={colorScheme == "dark" ? styles.inputdark : styles.inputlight}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          labelStyle={styles.label}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          style={colorScheme == "dark" ? styles.inputdark : styles.inputlight}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} color="#9747FF" radius={10} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} color="#4A158E" radius={10} />
      </View>
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
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
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
})