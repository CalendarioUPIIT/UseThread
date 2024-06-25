import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { StyleSheet, View, Alert, Pressable, Text,SafeAreaView, Switch, Button, Image } from 'react-native'

import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { Input } from '@rneui/themed'

import { useColorScheme } from 'nativewind'
import { StatusBar } from 'expo-status-bar'

import TopBar from '../../components/home/Screens/TopBar';

export default function Account({ session }: { session: Session }) {

  
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const {colorScheme, toggleColorScheme} = useColorScheme()
  
  return (

    <SafeAreaView className='flex-1 dark:bg-black dark:text-white'>
      <StatusBar style={colorScheme == "dark" ? "light" : "dark" } />

      <TopBar />

      <View style={styles.container}>
        <View className='flex items-center justify-center top-10'>
            <Avatar
              size={100}
              url={avatarUrl}
              onUpload={(url: string) => {
                setAvatarUrl(url)
                updateProfile({ username, website, avatar_url: url })
              }}
            />
          </View>

          <View style={styles.userInfo}>
          <Text style={styles.text} className='text-black dark:text-white'>{"Username"}</Text>
          <Text style={styles.text} className='text-black   dark:text-white'>{session?.user?.email}</Text>
          <Text style={styles.text} className='text-black  dark:text-white'>{"Descripción"}</Text>
        </View>
      </View>
          <View className='flex-row justify-center items-center space-x-2 top-3' >
            <Text className='dark:text-white'> Cambio de color </Text>
            <Switch value={colorScheme == "dark"} onChange={toggleColorScheme}/> 
          </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 40,
  },
  imagen: {
    borderRadius: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 40
  },
})