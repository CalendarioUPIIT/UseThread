import { View, Text } from 'react-native'
import React from 'react'
import { Session } from '@supabase/supabase-js'

export default function TextToImage({ session }: { session: Session }) {
  return (
    <View>
      <Text>TextToImage</Text>
    </View>
  )
}