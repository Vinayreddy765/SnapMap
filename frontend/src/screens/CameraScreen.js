import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";


const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [location, setLocation] = useState(null);

 useEffect(() => {
  (async () => {
    // Camera permission
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");

    // Location permission
    const locationPermission =
      await Location.requestForegroundPermissionsAsync();

    if (locationPermission.status === "granted") {
      const currentLocation =
        await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    }
  })();
}, []);

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>Camera permission denied</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        exif: true,
      });

      navigation.navigate("UploadConfirmationScreen", { photo, location });
    }
  };

  return (
  <View style={{ flex: 1 }}>
    <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing={facing}
      flash={flash}
    />

    {/* Overlay controls */}
    <View style={styles.controls}>
      <TouchableOpacity
        onPress={() => setFlash(flash === "off" ? "on" : "off")}
      >
        <Text style={styles.text}>
          Flash {flash === "on" ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shutter}
        onPress={takePicture}
      />

      <TouchableOpacity
        onPress={() =>
          setFacing(facing === "back" ? "front" : "back")
        }
      >
        <Text style={styles.text}>Flip</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

export default CameraScreen;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#ddd",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
