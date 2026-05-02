import styles from "./ProductGallery.module.css";

function ProductGallery({ title, images, activeIndex, onSelect }) {
  const currentImage = images[activeIndex] ?? images[0];

  return (
    <section className={styles.gallery}>
      <div className={styles.mainFrame}>
        <img className={styles.mainImage} src={currentImage} alt={title} />
      </div>

      <div className={styles.thumbRow}>
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className={`${styles.thumbButton} ${index === activeIndex ? styles.thumbActive : ""}`}
            onClick={() => onSelect(index)}
            aria-label={`Показать изображение ${index + 1}`}
          >
            <img className={styles.thumbImage} src={image} alt="" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default ProductGallery;
