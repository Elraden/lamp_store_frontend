import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStore } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity } from "../../store/actions";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./FavoritesPage.module.css";

function FavoritesPage() {
  const dispatch = useDispatch();
  const { catalogProducts } = useSelector((state) => state.catalog);
  const favoriteIds = useSelector((state) => state.favorites.ids);
  const { quantities, searchQuery } = useSelector((state) => state.ui);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const favoriteProducts = catalogProducts
    .filter((product) => favoriteIds.includes(product.id))
    .filter((product) => {
      if (!normalizedQuery) {
        return true;
      }

      return `${product.title} ${product.brand} ${product.article} ${product.category}`
        .toLowerCase()
        .includes(normalizedQuery);
    });

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId, quantities[productId] ?? 1));
  };

  return (
    <>
      <Breadcrumbs items={["Каталог", "Избранное"]} />

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Личный список</p>
          <h1>Избранное</h1>
          <p>{favoriteIds.length} товаров сохранено</p>
        </div>
        <FontAwesomeIcon icon={faHeart} />
      </section>

      {favoriteProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {favoriteProducts.map((item) => (
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
      ) : (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faStore} />
          <h2>В избранном пока пусто</h2>
          <p>Откройте карточку товара и нажмите кнопку избранного, чтобы сохранить его здесь.</p>
          <Link to="/">Перейти в каталог</Link>
        </div>
      )}
    </>
  );
}

export default FavoritesPage;
