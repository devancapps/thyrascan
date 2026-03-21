import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { useUserProfile } from "../hooks/useUserProfile";
import { useScanLimit } from "../hooks/useScanLimit";
import { fetchProduct, ProductNotFoundError } from "../services/openFoodFacts";
import { classifyIngredients } from "../logic/ingredientMatcher";
import { scoreProduct } from "../logic/scoringEngine";
import { saveScanResult } from "../firebase/firestore";
import BarcodeOverlay from "../components/BarcodeOverlay";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorCard from "../components/ErrorCard";
import { colors, spacing, buttonStyle, buttonTextStyle } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Scanner">;

export default function ScannerScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const { condition } = useUserProfile();
  const { canScan, recordScan } = useScanLimit(user?.uid, isPremium);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processingRef = useRef(false);

  async function handleBarcodeScanned(result: BarcodeScanningResult) {
    if (processingRef.current) return;
    processingRef.current = true;
    setScanned(true);
    setLoading(true);
    setError(null);

    try {
      if (!canScan) {
        navigation.replace("Paywall");
        return;
      }

      const product = await fetchProduct(result.data);
      const effectiveCondition = condition ?? "exploring";
      const matchedIngredients = classifyIngredients(
        product.ingredientsText,
        effectiveCondition,
      );
      const scoringResult = scoreProduct(matchedIngredients, effectiveCondition);
      const verdict = scoringResult.overallVerdict;

      // Fire-and-forget — never block the result screen on Firestore
      if (user?.uid) {
        recordScan().catch((e) =>
          console.warn("[ScannerScreen] recordScan failed:", e),
        );
        if (isPremium) {
          saveScanResult(user.uid, {
            productName: product.productName,
            barcode: result.data,
            verdict,
            matchedIngredients,
            condition: effectiveCondition,
            medicationWarning: !!scoringResult.medicationWarning,
          }).catch((e) =>
            console.warn("[ScannerScreen] saveScanResult failed:", e),
          );
        }
      }

      navigation.replace("Result", {
        productName: product.productName,
        barcode: result.data,
        verdict,
        matchedIngredients,
        scoringResult,
      });
    } catch (err) {
      if (err instanceof ProductNotFoundError) {
        setError("Product not found in database.");
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setError(
          __DEV__ ? `[DEV] ${msg}` : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  }

  function handleRetry() {
    setScanned(false);
    setError(null);
  }

  if (!permission) {
    return <LoadingSpinner fullScreen message="Requesting camera access..." />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Ionicons
          name="camera-outline"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to scan food barcodes. No photos are stored.
        </Text>
        <TouchableOpacity
          style={buttonStyle}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={buttonTextStyle}>Allow Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <BarcodeOverlay />

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <LoadingSpinner message="Looking up product..." />
          </View>
        </View>
      )}

      {error && (
        <View style={styles.loadingOverlay}>
          <ErrorCard
            message={error ?? "Something went wrong. Please try again."}
            onRetry={handleRetry}
            onDismiss={() => navigation.goBack()}
          />
        </View>
      )}

      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    marginLeft: spacing.md,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: "100%",
  },
});
