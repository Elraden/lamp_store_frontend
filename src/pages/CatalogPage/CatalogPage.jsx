import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  fetchProducts,
  incrementQuantity,
  setActiveCategory,
} from "../../store/actions";
import { ALL_PRODUCTS_CATEGORY } from "../../constants/catalog";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./CatalogPage.module.css";

function CatalogPage() {
  const dispatch = useDispatch();
  const { catalogProducts, error, isLoading } = useSelector((state) => state.catalog);
  const { activeCategory, quantities, searchQuery } = useSelector((state) => state.ui);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = catalogProducts.filter((product) => {
    const categoryMatches =
      activeCategory === ALL_PRODUCTS_CATEGORY || product.category === activeCategory;
    const searchMatches =
      !normalizedQuery ||
      `${product.title} ${product.brand} ${product.article} ${product.category}`
        .toLowerCase()
        .includes(normalizedQuery);

    return categoryMatches && searchMatches;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product, quantities[product.id] ?? 1));
  };

  return (
    <>
      <Breadcrumbs items={["Каталог"]} />

      <section className={styles.catalogHeader}>
        <div>
          <h1>Каталог</h1>
          <p>{activeCategory}</p>
        </div>
        <div className={styles.catalogMeta}>
          <span>{filteredProducts.length} товаров</span>
          {isLoading ? <span>Загрузка...</span> : null}
          {activeCategory !== ALL_PRODUCTS_CATEGORY ? (
            <button type="button" onClick={() => dispatch(setActiveCategory(ALL_PRODUCTS_CATEGORY))}>
              Сбросить фильтр
            </button>
          ) : null}
        </div>
      </section>

      {error && !isLoading ? (
        <div className={`${styles.emptyState} ${styles.apiErrorState}`}>
          <div className={styles.emptyIcon}>!</div>
          <h2>Каталог временно недоступен</h2>
          <p>
            Не получилось загрузить товары из API. Проверьте, что backend запущен, и повторите
            попытку.
          </p>
          <button type="button" onClick={() => dispatch(fetchProducts())}>
            Загрузить ещё раз
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              quantity={quantities[item.id] ?? 1}
              onIncrement={() => dispatch(incrementQuantity(item.id))}
              onDecrement={() => dispatch(decrementQuantity(item.id))}
              onAddToCart={() => handleAddToCart(item)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          В этой категории пока нет товаров. Выберите другую категорию или измените поиск.
        </div>
      )}
    </>
  );
}

export default CatalogPage;
