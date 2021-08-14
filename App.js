import React, { useContext } from "react";
import { Text, View, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import {
  useFonts,
  Pridi_200ExtraLight,
  Pridi_300Light,
  Pridi_400Regular,
  Pridi_500Medium,
  Pridi_600SemiBold,
  Pridi_700Bold,
} from '@expo-google-fonts/pridi';
import MianApp from "./src";

export default () => {
  let [fontsLoaded] = useFonts({
    Pridi_200ExtraLight,
    Pridi_300Light,
    Pridi_400Regular,
    Pridi_500Medium,
    Pridi_600SemiBold,
    Pridi_700Bold,
  });

  let fontSize = 24;
  let paddingVertical = 6;

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <MianApp />
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text
  //         style={{
  //           fontSize,
  //           paddingVertical,
  //           // Note the quoting of the value for `fontFamily` here; it expects a string!
  //           fontFamily: 'Pridi_200ExtraLight',
  //         }}>
  //         Pridi Extra Light
  //       </Text>

  //       <Text
  //         style={{
  //           fontSize,
  //           paddingVertical,
  //           // Note the quoting of the value for `fontFamily` here; it expects a string!
  //           fontFamily: 'Pridi_300Light',
  //         }}>
  //         Pridi Light
  //       </Text>

  //       <Text
  //         style={{
  //           fontSize,
  //           paddingVertical,
  //           // Note the quoting of the value for `fontFamily` here; it expects a string!
  //           fontFamily: 'Pridi_400Regular',
  //         }}>
  //         Pridi Regular ทดสอบ
  //       </Text>

  //       <Text
  //         style={{
  //           fontSize,
  //           paddingVertical,
  //           // Note the quoting of the value for `fontFamily` here; it expects a string!
  //           fontFamily: 'Pridi_500Medium',
  //         }}>
  //         Pridi Medium
  //       </Text>

  //       <Text
  //         style={{
  //           fontSize,
  //           paddingVertical,
  //           // Note the quoting of the value for `fontFamily` here; it expects a string!
  //           fontFamily: 'Pridi_600SemiBold',
  //         }}>
  //         Pridi Semi Bold
  //       </Text>

  //       <Text
  //         style={{
  //           fontSize,
  //           paddingVertical,
  //           // Note the quoting of the value for `fontFamily` here; it expects a string!
  //           fontFamily: 'Pridi_700Bold',
  //         }}>
  //         Pridi Bold
  //       </Text>
  //     </View>
    );
  }
};

// function App() {
//   return (
//       <MianApp />
//   );
// }

// export default App;