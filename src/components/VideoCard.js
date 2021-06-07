import React from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { Video } from "expo-av"
import { Card, Title } from "react-native-paper"
import { Dimensions } from "react-native"
import YoutubePlayer from "react-native-youtube-iframe";

const HEIGHT = Dimensions.get("window").height
const VideoCard = ({ item }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={{ flexDirection: "column", flex: 1 }}>

                <View style={{ width: "100%", alignItems: 'center' }}>
                        {
                            item.vdo_type === 'link' ? 
                                    <YoutubePlayer
                                        height={210}
                                        width={370}
                                        videoId={item.link_path.substring(32, 43)} 
                                        play={false}
                                        volume={50}
                                        playbackRate={1}
                                        playerParams={{
                                            cc_lang_pref: "us",
                                            showClosedCaptions: true
                                        }}
                                    /> 
                            :
                                <Video
                                    source={{
                                        uri: item.vdo_path
                                    }}
                                    rate={1.0}
                                    volume={1.0}
                                    isMuted={false}
                                    isLooping
                                    useNativeControls
                                    style={{
                                        width: '100%',
                                        height: 210,
                                    }}
                            /> 
                        }
                    </View>

                    <View style={{ flex: 1, alignSelf: 'center' }}>
                        <Title>
                            {item.vdo_title}
                        </Title>
                    </View>

                    
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "#fff",
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        // marginHorizontal: 4,
        marginVertical: 6,
        marginTop: 20,
    },
    cardContent: {
        // marginHorizontal: 18,
        // marginVertical: 10,
    },
})

export default VideoCard
