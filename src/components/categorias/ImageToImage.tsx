import { View, Text } from 'react-native'
import React from 'react'
import { Session } from '@supabase/supabase-js'

export default function ImageToImage( { session }: { session: Session } ) {
  return (
    <View>
      <Text>ImageToImage</Text>
    </View>
  )
}