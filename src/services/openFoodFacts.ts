import { OpenFoodFactsProduct } from "../types";

// v0 is the stable public API; v2 can be unreliable for React Native clients
const BASE_URL = "https://world.openfoodfacts.org/api/v0/product";

export class ProductNotFoundError extends Error {
  constructor() {
    super("Product not found in database.");
    this.name = "ProductNotFoundError";
  }
}

export class NetworkError extends Error {
  constructor(cause?: string) {
    super("Network error. Please check your connection and try again.");
    this.name = "NetworkError";
    if (cause && __DEV__) {
      console.error("[OpenFoodFacts] Fetch failed:", cause);
    }
  }
}

export async function fetchProduct(
  barcode: string,
): Promise<OpenFoodFactsProduct> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/${barcode}.json`);
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new NetworkError(cause);
  }

  if (!response.ok) {
    throw new NetworkError(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 0 || !data.product) {
    throw new ProductNotFoundError();
  }

  return {
    productName: data.product.product_name || "Unknown Product",
    ingredientsText: data.product.ingredients_text || "",
  };
}
