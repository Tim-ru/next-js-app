"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/axios";
import { productsService } from "@/services/products.service";
import { useAuthStore } from "@/store/auth.store";
import type { Product } from "@/types/product.types";

import styles from "./page.module.scss";

const PRODUCT_LIMIT = 12;
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsProductsLoading(true);
      setProductsError(null);

      try {
        const response = await productsService.getProducts({
          limit: PRODUCT_LIMIT,
        });

        if (!isMounted) {
          return;
        }

        setProducts(response.products.slice(0, PRODUCT_LIMIT));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setProductsError(getApiErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const canShowCartButton = isAuthInitialized && isAuthenticated;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Latest Products</span>
            <h1 className={styles.title}>
              A public storefront with auth-aware actions.
            </h1>
            <p className={styles.description}>
              The catalog stays open for guests, while signed-in users can see
              cart actions directly on each product card.
            </p>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Catalog status</span>
            <strong className={styles.summaryValue}>
              {PRODUCT_LIMIT} products
            </strong>
            <p className={styles.summaryText}>
              Loading and error states are handled on the client to keep the UX
              explicit.
            </p>
          </div>
        </section>

        <section className={styles.catalog} aria-labelledby="catalog-title">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Home page</span>
              <h2 className={styles.sectionTitle} id="catalog-title">
                Latest arrivals
              </h2>
            </div>
          </div>

          {isProductsLoading ? (
            <div className={styles.grid} aria-live="polite" aria-busy="true">
              {Array.from({ length: PRODUCT_LIMIT }).map((_, index) => (
                <article className={styles.skeletonCard} key={index}>
                  <div className={styles.skeletonMedia} />
                  <div className={styles.skeletonLine} />
                  <div
                    className={`${styles.skeletonLine} ${styles.shortLine}`}
                  />
                  <div
                    className={`${styles.skeletonLine} ${styles.tinyLine}`}
                  />
                </article>
              ))}
            </div>
          ) : productsError ? (
            <div className={styles.stateCard} role="alert">
              <h3 className={styles.stateTitle}>Could not load products</h3>
              <p className={styles.stateText}>{productsError}</p>
              <button
                className={styles.retryButton}
                type="button"
                onClick={() => setRequestId((currentValue) => currentValue + 1)}
              >
                Try again
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <article className={styles.card} key={product.id}>
                  <div className={styles.media}>
                    <Image
                      className={styles.image}
                      src={product.thumbnail}
                      alt={product.title}
                      width={320}
                      height={320}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <span className={styles.category}>
                      {formatCategory(product.category)}
                    </span>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        {formatPrice(product.price)}
                      </span>
                      {canShowCartButton ? (
                        <button className={styles.cartButton} type="button">
                          Add to cart
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
