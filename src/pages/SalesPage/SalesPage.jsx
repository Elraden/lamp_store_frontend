import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  setActiveCategory,
} from "../../store/actions";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./SalesPage.module.css";

function SalesPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.catalog.catalogProducts);
  const quantities = useSelector((state) => state.ui.quantities);
  const saleProducts = products.filter((product) => product.category === "Лампочки по акции");

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId, quantities[productId] ?? 1));
  };

  return (
    <>
      <Breadcrumbs items={["Каталог", "Акции"]} />

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Спецпредложения</p>
          <h1>Акции на лампочки</h1>
          <p>
            Подборка товаров со сниженной ценой. Акционные позиции можно сразу добавить в
            корзину или открыть карточку для просмотра характеристик.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(setActiveCategory("Лампочки по акции"))}
        >
          Показать в каталоге
        </button>
      </section>

      <div className={styles.benefits}>
        <article>
          <strong>До 25%</strong>
          <span>скидка на выбранные LED-товары</span>
        </article>
        <article>
          <strong>3 дня</strong>
          <span>резерв цены после оформления заказа</span>
        </article>
        <article>
          <strong>0 Р</strong>
          <span>скидка не требует промокода</span>
        </article>
      </div>

      <section className={styles.productsSection}>
        <h2>Товары по акции</h2>
        <div className={styles.productsGrid}>
          {saleProducts.map((item) => (
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

export default SalesPage;
