import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

function ProductCard({ product, quantity, onIncrement, onDecrement, onAddToCart }) {
  const availabilityClass =
    styles[`availability_${product.availabilityStatus}`] ?? styles.availability_unknown;
  const isPurchasable = !["out_of_stock", "discontinued"].includes(product.availabilityStatus);

  return (
    <article className={styles.card}>
      <Link className={styles.productLink} to={`/product/${product.id}`}>
        <div className={styles.imageFrame}>
          <img className={styles.image} src={product.image} alt={product.title} />
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.meta}>
            {product.brand} / {product.article}
          </p>
        </div>
      </Link>

      <div className={styles.footer}>
        <div className={styles.priceBlock}>
          <p className={styles.price}>{product.price} Р</p>
          <span className={`${styles.availability} ${availabilityClass}`}>
            {product.availability}
          </span>
        </div>

        <div className={styles.actions}>
          <div className={styles.counter}>
            <button type="button" onClick={onDecrement} aria-label="Уменьшить количество">
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={onIncrement} aria-label="Увеличить количество">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <button
            className={styles.cartButton}
            type="button"
            onClick={onAddToCart}
            disabled={!isPurchasable}
            aria-label="Добавить в корзину"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
