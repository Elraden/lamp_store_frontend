import styles from "./Characteristics.module.css";

function Characteristics({ items }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Характеристики</h2>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.label} className={styles.row}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.line} aria-hidden="true" />
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Characteristics;
