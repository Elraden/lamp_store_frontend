import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMinus,
  faPlus,
  faTag,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementCartItem,
  decrementQuantity,
  incrementCartItem,
  incrementQuantity,
  removeCartItem,
} from "../../store/actions";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./CartPage.module.css";

function CartPage() {
  const dispatch = useDispatch();
  const catalog = useSelector((state) => state.catalog);
  const quantities = useSelector((state) => state.ui.quantities);
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId, quantities[productId] ?? 1));
  };

  return (
    <>
      <Breadcrumbs items={["Каталог", "Корзина"]} />
      <h1 className={styles.title}>Корзина</h1>

      <div className={styles.cartLayout}>
        <div className={styles.cartMain}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <article key={item.id} className={styles.cartItem}>
                <img className={styles.itemImage} src={item.image} alt={item.title} />
                <div className={styles.itemInfo}>
                  <h2>{item.title}</h2>
                  <p>Бренд: {item.brand}</p>
                  <p>Артикул: {item.article}</p>
                  <p>{item.availability}</p>
                </div>
                <span className={styles.unitPrice}>{item.price} Р</span>
                <div className={styles.counter}>
                  <button type="button" onClick={() => dispatch(decrementCartItem(item.id))}>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => dispatch(incrementCartItem(item.id))}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <span className={styles.lineTotal}>{item.price * item.quantity} Р</span>
                <button
                  className={styles.removeButton}
                  type="button"
                  aria-label={`Удалить ${item.title}`}
                  onClick={() => dispatch(removeCartItem(item.id))}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </article>
            ))}
          </div>

          <div className={styles.promoBar}>
            <span>
              <FontAwesomeIcon icon={faTag} /> Промокод / скидка / блок спецпредложений
            </span>
            <input type="text" placeholder="Поле ввода" aria-label="Промокод" />
            <button type="button">Применить</button>
          </div>
        </div>

        <aside className={styles.orderBox}>
          <h2>Ваш заказ</h2>
          <div className={styles.orderLine}>
            <span>Товаров:</span>
            <span>{totalCount}</span>
          </div>
          <div className={styles.orderLine}>
            <span>Сумма:</span>
            <span>{subtotal} Р</span>
          </div>
          <div className={styles.orderLine}>
            <span>Скидка:</span>
            <span>0 Р</span>
          </div>
          <div className={styles.orderTotal}>
            <span>Итого:</span>
            <strong>{subtotal} Р</strong>
          </div>
          <Link className={styles.checkoutButton} to="/checkout">
            <FontAwesomeIcon icon={faCartShopping} />
            <span>Оформить заказ</span>
          </Link>
          <p>Оплата курьеру при получении</p>
        </aside>
      </div>

      <section className={styles.recommendations}>
        <h2>Рекомендуем добавить</h2>
        <div className={styles.productsGrid}>
          {catalog.similarProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              quantity={quantities[item.id] ?? 1}
              onIncrement={() => dispatch(incrementQuantity(item.id))}
              onDecrement={() => dispatch(decrementQuantity(item.id))}
              onAddToCart={() => handleAddToCart(item.id)}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default CartPage;
