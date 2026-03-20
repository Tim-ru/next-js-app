import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Stage 1</span>
        <h1 className={styles.title}>
          Project setup is ready for the test task.
        </h1>
        <p className={styles.description}>
         
        </p>
      </section>
    </main>
  );
}
