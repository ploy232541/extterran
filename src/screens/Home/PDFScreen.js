import React, { Component } from 'react'

import { StyleSheet, View, Text } from 'react-native'
import PDFReader from 'rn-pdf-reader-js'
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
 class PDFScreen extends Component {
     constructor(props) {
         super(props);
         
     }
 
  render() {
         let pdfLink=this.props.route.params.address
         console.log(this.props);
    return (
      <View style={styles.container}>
        {/* <Text>{Constants.manifest.sdkVersion}</Text> */}
        <PDFReader
          source={{
            uri: pdfLink,
          }}
          webviewProps={{
            startInLoadingState: true,
          }}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
})
export default function(props) {
    const navigation = useNavigation();
    return <PDFScreen {...props} navigation={navigation} />;
  }