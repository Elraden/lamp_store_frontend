import styles from "./BrandsStrip.module.css";

function BrandsStrip({ brands }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Бренды</h2>

      <div className={styles.grid}>
        {brands.map((brand) => (
          <article key={brand} className={styles.brandCard}>
            <span>{brand}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BrandsStrip;
