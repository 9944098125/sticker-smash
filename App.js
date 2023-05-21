import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import domtoimage from "dom-to-image";

import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import IconButton from "./components/IconButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";

export default function App() {
  const imageRef = React.useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }
  const PlaceholderImage = require("./assets/images/background-image.png");

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showAppOptions, setShowAppOptions] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [pickedImage, setPickedImage] = React.useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image");
    }
  };

  function onCloseModal() {
    setIsVisible(false);
  }

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsVisible(true);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement("a");
        link.download = "sticker-smash.jpeg";
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <View ref={imageRef} collapsable={false} style={styles.imageContainer}>
        <ImageViewer
          placeholderImage={PlaceholderImage}
          selectedImage={selectedImage}
        />
        {pickedImage !== null && (
          <EmojiSticker imageSize={40} stickerSource={pickedImage} />
        )}
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            onPress={pickImageAsync}
            theme="primary"
            label="Choose an Image"
          />
          <Button
            onPress={() => setShowAppOptions(true)}
            label="Use this Image"
          />
        </View>
      )}
      <EmojiPicker isVisible={isVisible} onClose={onCloseModal}>
        <EmojiList onSelect={setPickedImage} onCloseEmojiModal={onCloseModal} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 50,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
    marginTop: 50,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 50,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
