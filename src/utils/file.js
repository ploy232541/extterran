import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const downloadFIle = async (fileLink, fileName) => {
  let path = fileLink.split('/');
  const file_name = path[path.length-1];
  const extend = file_name.split('.');
  const fileUri = FileSystem.documentDirectory + `${encodeURI(fileName)}.${extend[1]}`;
  const { uri } = await FileSystem.downloadAsync(fileLink, fileUri);
  await Sharing.shareAsync(uri);
};
