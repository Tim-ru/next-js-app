import { api } from "@/lib/axios";
import type { Product, ProductsResponse } from "@/types/product.types";

interface GetProductsParams {
  limit?: number;
  skip?: number;
}

const PRODUCTS_ENDPOINT = "/products";

export const productsService = {
  async getProducts({
    limit = 12,
    skip = 0,
  }: GetProductsParams = {}): Promise<ProductsResponse> {
    const { data } = await api.get<ProductsResponse>(PRODUCTS_ENDPOINT, {
      params: {
        limit,
        skip,
      },
    });

    return data;
  },

  async getProductById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);

    return data;
  },
};
