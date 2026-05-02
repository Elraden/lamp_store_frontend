import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import styles from "./ProductSummary.module.css";

function ProductSummary({ product, isFavorite, onToggleFavorite }) {
  return (
    <section className={styles.summary}>
      <h1 className={styles.title}>{product.title}</h1>
      <p className={styles.article}>Артикул: {product.article}</p>

      <div className={styles.ratingRow}>
        <span className={styles.stars} aria-label={`Рейтинг ${product.rating} из 5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < product.rating ? faSolidStar : faRegularStar}
            />
          ))}
        </span>
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ""}`}
          type="button"
          onClick={onToggleFavorite}
        >
          <FontAwesomeIcon icon={faHeart} />
          <span>{isFavorite ? "В избранном" : "В избранное"}</span>
        </button>
      </div>

      <p className={styles.description}>Краткое описание: {product.shortDescription}</p>
    </section>
  );
}

export default ProductSummary;
