"use client";

import { useAuthStore } from "@/store/auth.store";

import styles from "./footer.module.scss";

export function Footer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.year}>© {year}</span>
        {isAuthenticated && user ? (
          <span className={styles.session}>Logged as {user.email}</span>
        ) : null}
      </div>
    </footer>
  );
}
