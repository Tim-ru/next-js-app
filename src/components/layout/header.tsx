"use client";

import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";

import styles from "./header.module.scss";

export function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const fullName =
    user && isAuthenticated ? `${user.firstName} ${user.lastName}` : null;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>DummyJSON Shop</span>
          <span className={styles.brandNote}>
            Daily picks from the public API
          </span>
        </Link>

        <div className={styles.actions}>
          {fullName ? (
            <>
              <span className={styles.userName}>{fullName}</span>
              <button
                className={styles.logoutButton}
                type="button"
                onClick={logout}
                disabled={isAuthLoading}
              >
                Logout
              </button>
            </>
          ) : (
            <Link className={styles.loginLink} href="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
