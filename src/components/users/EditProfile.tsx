import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { StyleSheet, View, Alert, Pressable, Text, SafeAreaView, Switch, Button } from 'react-native'

import { Session } from '@supabase/supabase-js'
import { Input } from '@rneui/themed'
import Avatar from './Avatar'

import { useColorScheme } from 'nativewind'
import { StatusBar } from 'expo-status-bar'

export default function Account({ session }: { session: Session }) {

    console.log(session)

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

    const { colorScheme, toggleColorScheme } = useColorScheme()

    return (

        <SafeAreaView className='flex-1 dark:bg-black dark:text-whites'>
            <StatusBar style={colorScheme == "dark" ? "light" : "dark"} />

            <View style={styles.verticallySpaced}>
                <Pressable
                    disabled={loading}
                    style={[styles.button, styles.btnSave]}
                    onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })} >
                    <Text style={styles.text}> {loading ? 'Guardando ...' : 'Guardar'} </Text>
                </Pressable>
            </View>

            <View style={styles.container} className='flex items-center'>
                <View className='flex items-center justify-center w-screen m-0 p-0'>
                    <Avatar
                        size={80}
                        url={avatarUrl}
                        onUpload={(url: string) => {
                            setAvatarUrl(url)
                            updateProfile({ username, website, avatar_url: url })
                        }}
                    />
                    <Text className='m-2 dark:text-purple2 text-purple font-bold text-xl'>Editar Foto</Text>
                </View>
            </View>

            <View>
                <View style={[styles.verticallySpaced, styles.mr20]}>
                    <Input
                        selectionColor={'black'}
                        label="Username"
                        value={username || ''}
                        placeholder={'Name'}
                        onChangeText={(text: string) => setUsername(text)} 
                        />
                </View>

                <View style={[styles.verticallySpaced, styles.mr20]}>
                    <Input label="Email" value={session?.user?.email} disabled />
                </View>

                <View style={[styles.verticallySpaced, styles.mr20]}>
                    <Input
                        selectionColor={'black'}
                        label="Descripcion"
                        value={website || ''}
                        placeholder='Descripcion'
                        onChangeText={(text: string) => setWebsite(text)} />
                </View>
            </View>

            <View style={[styles.verticallySpaced]} className='items-center'>
                <Pressable
                    style={[styles.button, styles.btnOut]}
                    onPress={() => supabase.auth.signOut()}>
                    <Text style={styles.text}> Sign out </Text>
                </Pressable>
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
    mr20: {
        marginHorizontal: 30,
    },
    imagen: {
        borderRadius: 100,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 50,
        elevation: 3,
    },
    btnSave: {
        backgroundColor: '#4A158E',
        width: 120,
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    btnOut: {
        backgroundColor: '#282828',
        width: 310,
        marginHorizontal: 30,
        padding: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
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
    inputs: {
        fontSize: 16,
        fontWeight: 'thin'
    },
})