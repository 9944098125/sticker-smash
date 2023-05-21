import { View, Text, Image, StyleSheet } from "react-native";

const ImageViewer = (props) => {
  const { placeholderImage, selectedImage } = props;

  const finalImage =
    selectedImage !== null ? { uri: selectedImage } : placeholderImage;
  return (
    <View>
      <Image source={finalImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 450,
    width: 320,
    borderRadius: 15,
  },
});

export default ImageViewer;
