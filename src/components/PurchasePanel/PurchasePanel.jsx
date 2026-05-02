import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./PurchasePanel.module.css";

function PurchasePanel({
  price,
  stock,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  paymentNote,
}) {
  return (
    <aside className={styles.panel}>
      <p className={styles.price}>{price} Р</p>
      <p className={styles.stock}>в наличии: {stock} шт.</p>

      <div className={styles.counter}>
        <button type="button" className={styles.counterButton} onClick={onDecrement}>
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <span className={styles.counterValue}>{quantity}</span>
        <button type="button" className={styles.counterButton} onClick={onIncrement}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <button
        className={styles.cartButton}
        type="button"
        onClick={onAddToCart}
        aria-label="Добавить в корзину"
      >
        <FontAwesomeIcon icon={faCartShopping} />
      </button>

      <p className={styles.paymentNote}>{paymentNote}</p>
    </aside>
  );
}

export default PurchasePanel;
