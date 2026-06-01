import { useMemo } from "react";
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

const today = new Date();
today.setHours(0, 0, 0, 0);

const parseDate = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isPromotionActive = (promotion) => {
  if (!promotion?.start_date || !promotion?.end_date) {
    return true;
  }

  return parseDate(promotion.start_date) <= today && today <= parseDate(promotion.end_date);
};

const getBestPromotion = (promotions = []) =>
  promotions
    .filter(isPromotionActive)
    .sort((left, right) => Number(right.discount) - Number(left.discount))[0] ?? null;

const formatDate = (value) => new Date(value).toLocaleDateString("ru-RU");

const getDiscountedPrice = (price, discount) =>
  Number((Number(price) * (1 - Number(discount) / 100)).toFixed(2));

function SalesPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.catalog.catalogProducts);
  const quantities = useSelector((state) => state.ui.quantities);

  const promotionGroups = useMemo(() => {
    const groups = new Map();

    products.forEach((product) => {
      const promotion = getBestPromotion(product.promotions);

      if (!promotion) {
        return;
      }

      if (!groups.has(promotion.promo_id)) {
        groups.set(promotion.promo_id, {
          promotion,
          products: [],
        });
      }

      groups.get(promotion.promo_id).products.push(product);
    });

    return Array.from(groups.values()).sort(
      (left, right) => Number(right.promotion.discount) - Number(left.promotion.discount),
    );
  }, [products]);

  const maxDiscount = promotionGroups.reduce(
    (max, group) => Math.max(max, Number(group.promotion.discount ?? 0)),
    0,
  );

  const handleAddToCart = (product, promotion) => {
    const discountedProduct = {
      ...product,
      price: getDiscountedPrice(product.price, promotion.discount),
      activePromotion: promotion,
    };

    dispatch(addToCart(discountedProduct, quantities[product.id] ?? 1));
  };

  return (
    <>
      <Breadcrumbs items={["Каталог", "Акции"]} />

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Спецпредложения</p>
          <h1>Акции на лампочки</h1>
          <p>
            Выбирайте товары со сниженной ценой и добавляйте их в корзину прямо со страницы акций.
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
          <strong>{maxDiscount > 0 ? `До ${maxDiscount}%` : "0%"}</strong>
          <span>скидка на выбранные товары</span>
        </article>
        <article>
          <strong>{promotionGroups.length}</strong>
          <span>актуальных предложений</span>
        </article>
        <article>
          <strong>Сегодня</strong>
          <span>лучшие цены в каталоге</span>
        </article>
      </div>

      <section className={styles.productsSection}>
        <h2>Товары по акциям</h2>

        {promotionGroups.length > 0 ? (
          <div className={styles.promotionsList}>
            {promotionGroups.map(({ promotion, products: promotionProducts }) => (
              <article className={styles.promotionBlock} key={promotion.promo_id}>
                <header className={styles.promotionHeader}>
                  <div>
                    <p className={styles.eyebrow}>Скидка {promotion.discount}%</p>
                    <h3>{promotion.name}</h3>
                    <span>
                      {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                    </span>
                  </div>
                  <p>{promotion.description}</p>
                </header>

                <div className={styles.productsGrid}>
                  {promotionProducts.map((item) => {
                    const discountedPrice = getDiscountedPrice(item.price, promotion.discount);
                    const productForCard = {
                      ...item,
                      price: discountedPrice,
                    };

                    return (
                      <div className={styles.saleTile} key={`${promotion.promo_id}-${item.id}`}>
                        <div className={styles.priceNote}>
                          <span>{Number(item.price).toLocaleString("ru-RU")} ₽</span>
                          <strong>{discountedPrice.toLocaleString("ru-RU")} ₽</strong>
                        </div>
                        <ProductCard
                          product={productForCard}
                          quantity={quantities[item.id] ?? 1}
                          onIncrement={() => dispatch(incrementQuantity(item.id))}
                          onDecrement={() => dispatch(decrementQuantity(item.id))}
                          onAddToCart={() => handleAddToCart(item, promotion)}
                        />
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            Сейчас нет активных акций. Новые предложения появятся здесь после добавления в
            админ-панели.
          </div>
        )}
      </section>
    </>
  );
}

export default SalesPage;
