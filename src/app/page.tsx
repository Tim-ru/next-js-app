"use client";

import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";

import styles from "./page.module.scss";

export default function Home() {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Stage 2</span>
        <h1 className={styles.title}>
          Client-side auth bootstrap is wired into the App Router.
        </h1>
        <p className={styles.description}>
          Zustand restores the saved session from localStorage on the client and
          keeps the axios bearer token in sync for protected requests.
        </p>
        <div className={styles.statusCard}>
          <p className={styles.statusLabel}>Session state</p>
          {!isAuthInitialized ? (
            <p className={styles.statusText}>Restoring session from storage...</p>
          ) : isAuthenticated && user ? (
            <div className={styles.statusContent}>
              <p className={styles.statusText}>
                Signed in as <strong>{user.firstName}</strong> (@{user.username})
              </p>
              <div className={styles.actions}>
                <button
                  className={styles.secondaryAction}
                  type="button"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.statusContent}>
              <p className={styles.statusText}>
                No active session found. Open the login page to start one.
              </p>
              <div className={styles.actions}>
                <Link className={styles.primaryAction} href="/login">
                  Open login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
