"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

import styles from "./page.module.scss";

interface FieldErrors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const authError = useAuthStore((state) => state.authError);
  const login = useAuthStore((state) => state.login);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (isAuthInitialized && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthInitialized, isAuthenticated, router]);

  function validateForm(): { isValid: boolean; normalizedUsername: string } {
    const normalizedUsername = username.trim();
    const nextErrors: FieldErrors = {};

    if (!normalizedUsername) {
      nextErrors.username = "Enter your username.";
    } else if (normalizedUsername.length < 3) {
      nextErrors.username = "Username must contain at least 3 characters.";
    }

    if (!password.trim()) {
      nextErrors.password = "Enter your password.";
    } else if (password.length < 3) {
      nextErrors.password = "Password must contain at least 3 characters.";
    }

    setFieldErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      normalizedUsername,
    };
  }

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);

    if (fieldErrors.username) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        username: undefined,
      }));
    }

    if (authError) {
      clearAuthError();
    }
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);

    if (fieldErrors.password) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        password: undefined,
      }));
    }

    if (authError) {
      clearAuthError();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthInitialized || isAuthLoading) {
      return;
    }

    clearAuthError();

    const { isValid, normalizedUsername } = validateForm();

    if (!isValid) {
      return;
    }

    try {
      await login({
        username: normalizedUsername,
        password,
        expiresInMins: 60,
      });

      router.replace("/");
    } catch {
      return;
    }
  }

  const isFormDisabled = isAuthLoading || !isAuthInitialized;

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
        <h1 className={styles.title}>
          Sign in to restore the protected session
        </h1>
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
                className={`${styles.input} ${
                  fieldErrors.username ? styles.inputError : ""
                }`}
                type="text"
                name="username"
                autoComplete="username"
                placeholder="emilys"
                value={username}
                onChange={handleUsernameChange}
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={
                  fieldErrors.username ? "username-error" : undefined
                }
                disabled={isFormDisabled}
                required
              />
              {fieldErrors.username ? (
                <span
                  className={styles.fieldError}
                  id="username-error"
                  role="alert"
                >
                  {fieldErrors.username}
                </span>
              ) : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <input
                className={`${styles.input} ${
                  fieldErrors.password ? styles.inputError : ""
                }`}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="emilyspass"
                value={password}
                onChange={handlePasswordChange}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                disabled={isFormDisabled}
                required
              />
              {fieldErrors.password ? (
                <span
                  className={styles.fieldError}
                  id="password-error"
                  role="alert"
                >
                  {fieldErrors.password}
                </span>
              ) : null}
            </label>

            {authError ? (
              <p className={styles.errorMessage} role="alert">
                {authError}
              </p>
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
                {isAuthLoading ? "Signing in..." : "Sign in"}
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
