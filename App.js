import React, { useContext } from "react";
import { Text, View, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import * as Updates from 'expo-updates';

import MianApp from "./src";

 function App() {
  try {
    const update =  Updates.checkForUpdateAsync();
    if (update.isAvailable) {
       Updates.fetchUpdateAsync();
      // ... notify user of update ...
      Updates.reloadAsync();
    }
  } catch (e) {
    // handle or log error
  }
  return (
      <MianApp />
  );
}

export default App;
