import * as React from "react"
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { Card, Paragraph, Text, Dialog, Portal, Title } from "react-native-paper"
import HTML from "react-native-render-html";
var decode = require('decode-html');

const HEIGHT = Dimensions.get("window").height
const HowtoUseCard = ({ title, imgSrc, details }) => {
    const [visible, setVisible] = React.useState(false)

    const showDialog = () => setVisible(true)

    const hideDialog = () => setVisible(false)
    const containerStyle = { backgroundColor: "white", padding: 20 }
    return (
        <TouchableOpacity onPress={showDialog}>
            <Card>
                <Card.Cover
                    source={{ uri: imgSrc }}
                    style={{ height: HEIGHT * 0.125, width: "100%" }}
                />
                <Card.Content>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontWeight: "bold",
                            fontSize: 16,
                            marginVertical: 10,
                        }}>
                        {title}
                    </Text>
                    {/* <Paragraph numberOfLines={3}>{details}</Paragraph> */}
                </Card.Content>
            </Card>
            <Portal>
                <Dialog
                    visible={visible} onDismiss={hideDialog} style={{backgroundColor:'#2BB5EE', color:'white', alignItems:'center'}}>
                    <Title style={{color:'white', marginVertical:15}}>{title}</Title>
                    <Dialog.Content style={{backgroundColor:'white', marginBottom:30, height:HEIGHT*0.5, width: '100%'}}>
                        {/* <Text style={{marginVertical:20, marginHorizontal:20}}>{details}</Text> */}
                        <View style={{flex:1}}>
                            <HTML 
                                html={decode(decode(details))}
                                // onLinkPress={(event, href)=>{Linking.openURL(href)}}
                                ignoredStyles= {['width','height']} 
                                tagsStyles={{ img:{flex:1, alignSelf:'center', }
                                }}
                            />
                        </View>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </TouchableOpacity>
    )
}

export default HowtoUseCard
