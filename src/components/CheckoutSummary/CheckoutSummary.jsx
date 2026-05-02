import { Link } from "react-router-dom";
import styles from "./CheckoutSummary.module.css";

function CheckoutSummary({ items, showButton = false }) {
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Контактные данные</h2>

      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.summaryItem}>
            {item.title} × {item.quantity}
          </div>
        ))}
      </div>

      <div className={styles.lines}>
        {showButton ? (
          <div className={styles.line}>
            <span>Товаров:</span>
            <span>{totalCount}</span>
          </div>
        ) : null}
        <div className={styles.line}>
          <span>Сумма:</span>
          <span>{subtotal} Р</span>
        </div>
        <div className={styles.line}>
          <span>Доставка:</span>
          <span>Уточняется</span>
        </div>
      </div>

      <div className={styles.total}>
        <span>Итого:</span>
        <strong>{subtotal} Р</strong>
      </div>

      {showButton ? (
        <Link className={styles.checkoutButton} to="/checkout">
          Оформить заказ
        </Link>
      ) : null}
    </aside>
  );
}

export default CheckoutSummary;
