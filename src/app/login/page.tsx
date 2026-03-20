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

interface ValidationResult {
  isValid: boolean;
  normalizedUsername: string;
  normalizedPassword: string;
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

  function validateForm(): ValidationResult {
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();
    const nextErrors: FieldErrors = {};

    if (!normalizedUsername) {
      nextErrors.username = "Enter your username.";
    } else if (normalizedUsername.length < 3) {
      nextErrors.username = "Username must contain at least 3 characters.";
    }

    if (!normalizedPassword) {
      nextErrors.password = "Enter your password.";
    } else if (normalizedPassword.length < 3) {
      nextErrors.password = "Password must contain at least 3 characters.";
    }

    setFieldErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      normalizedUsername,
      normalizedPassword,
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

    const { isValid, normalizedUsername, normalizedPassword } = validateForm();

    if (!isValid) {
      return;
    }

    try {
      await login({
        username: normalizedUsername,
        password: normalizedPassword,
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
            Active session detected. Returning to the catalog.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>Login</span>
        <h1 className={styles.title}>Login to your account</h1>
        <p className={styles.description}>
          Enter your DummyJSON username and password to access authorized user
          actions in the product catalog.
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
                Use valid DummyJSON credentials, for example `emilys` /
                `emilyspass`.
              </p>
            )}

            <div className={styles.actions}>
              <button
                className={styles.primaryAction}
                type="submit"
                disabled={isFormDisabled}
              >
                {isAuthLoading ? "Logging in..." : "Login"}
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
