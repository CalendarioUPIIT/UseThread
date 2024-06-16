import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from './components/users/Auth'
import Account from './components/users/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { NavigationContainer } from '@react-navigation/native'
import { Navigator } from './navigator/Navigator'

export default function UseThread() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer> 
      {
      session && session.user 
      ? <Navigator key={session.user.id} session={session}/> 
      : <Auth />
      }
    </NavigationContainer>
  )
}