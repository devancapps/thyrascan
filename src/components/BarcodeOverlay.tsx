import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../styles/theme";

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.7;

export default function BarcodeOverlay() {
  return (
    <View style={styles.container}>
      <View style={styles.topOverlay} />
      <View style={styles.middleRow}>
        <View style={styles.sideOverlay} />
        <View style={styles.frame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={styles.sideOverlay} />
      </View>
      <View style={styles.bottomOverlay}>
        <Text style={styles.instruction}>Align barcode within frame</Text>
      </View>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: colors.overlayMedium,
  },
  middleRow: {
    flexDirection: "row",
    height: FRAME_SIZE * 0.5,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: colors.overlayMedium,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE * 0.5,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: colors.overlayMedium,
    alignItems: "center",
    paddingTop: 32,
  },
  instruction: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: colors.primary,
    borderBottomRightRadius: 4,
  },
});
