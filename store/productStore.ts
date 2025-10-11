import { create } from "zustand";
import { fetcherWithToken, fetcherWithTokenConfig } from "@/utils/fetcher";
import { Product } from "@/types"; // 👈 Define Product type in your types file

interface ProductStore {
  products: Product[];
  selectedProductId: string;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  setSelectedProductId: (id: string) => void;
  createProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProductId: "",
  loading: false,
  error: null,

  // ✅ Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetcherWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
    }
  },

  // ✅ Select a product
  setSelectedProductId: (id: string) => set({ selectedProductId: id }),

  // ✅ Create product
  createProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(product),
        }
      );
      // Refresh
      const data = await fetcherWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: "Failed to create product", loading: false });
    }
  },

  // ✅ Update product
  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(product),
        }
      );
      // Refresh
      const data = await fetcherWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: "Failed to update product", loading: false });
    }
  },

  // ✅ Delete product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetcherWithTokenConfig(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        { method: "DELETE" }
      );
      // Refresh
      const data = await fetcherWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: "Failed to delete product", loading: false });
    }
  },
}));
