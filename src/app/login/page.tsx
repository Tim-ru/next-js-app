"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

import styles from "./page.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthInitialized && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthInitialized, isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({
        username,
        password,
        expiresInMins: 60,
      });

      router.replace("/");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormDisabled = isSubmitting || !isAuthInitialized;

  if (isAuthInitialized && isAuthenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <span className={styles.eyebrow}>Login</span>
          <h1 className={styles.title}>Redirecting to the home page</h1>
          <p className={styles.helperText}>
            Saved session is active, so the login route is no longer needed.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>Login</span>
        <h1 className={styles.title}>Sign in to restore the protected session</h1>
        <p className={styles.description}>
          localStorage hydration runs only on the client, so this page waits for
          auth bootstrap before showing the form and redirects active sessions
          back to the home page.
        </p>

        {!isAuthInitialized ? (
          <p className={styles.helperText}>Checking saved session...</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Username</span>
              <input
                className={styles.input}
                type="text"
                name="username"
                autoComplete="username"
                placeholder="emilys"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <input
                className={styles.input}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="emilyspass"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {errorMessage ? (
              <p className={styles.errorMessage}>{errorMessage}</p>
            ) : (
              <p className={styles.helperText}>
                Use any valid DummyJSON credentials.
              </p>
            )}

            <div className={styles.actions}>
              <button
                className={styles.primaryAction}
                type="submit"
                disabled={isFormDisabled}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
              <Link className={styles.secondaryAction} href="/">
                Back home
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
