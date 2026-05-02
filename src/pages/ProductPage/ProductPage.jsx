import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  setActiveImage,
  toggleFavorite,
} from "../../store/actions";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import ProductSummary from "../../components/ProductSummary/ProductSummary";
import PurchasePanel from "../../components/PurchasePanel/PurchasePanel";
import Characteristics from "../../components/Characteristics/Characteristics";
import ProductCard from "../../components/ProductCard/ProductCard";
import BrandsStrip from "../../components/BrandsStrip/BrandsStrip";
import styles from "./ProductPage.module.css";

function ProductPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const catalog = useSelector((state) => state.catalog);
  const ui = useSelector((state) => state.ui);
  const favorites = useSelector((state) => state.favorites.ids);

  const product = catalog.catalogProducts.find((item) => item.id === productId);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const normalizedQuery = ui.searchQuery.trim().toLowerCase();
  const similarProducts = catalog.catalogProducts
    .filter((item) => item.id !== product.id)
    .filter((item) => item.category === product.category || item.base === product.base)
    .slice(0, 6);

  const visibleSimilarProducts = normalizedQuery
    ? similarProducts.filter((item) => {
        const source = `${item.title} ${item.brand} ${item.article}`.toLowerCase();
        return source.includes(normalizedQuery);
      })
    : similarProducts;

  const handleAddToCart = (selectedProductId) => {
    const quantity = ui.quantities[selectedProductId] ?? 1;
    dispatch(addToCart(selectedProductId, quantity));
  };

  return (
    <>
      <Breadcrumbs items={["Каталог", product.category, product.title]} />

      <section className={styles.heroSection}>
        <div className={styles.productSummaryArea}>
          <ProductGallery
            title={product.title}
            images={product.images}
            activeIndex={ui.activeImageIndex}
            onSelect={(index) => dispatch(setActiveImage(index))}
          />
          <ProductSummary
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={() => dispatch(toggleFavorite(product.id))}
          />
        </div>

        <PurchasePanel
          price={product.price}
          stock={product.stock}
          quantity={ui.quantities[product.id] ?? 1}
          onIncrement={() => dispatch(incrementQuantity(product.id))}
          onDecrement={() => dispatch(decrementQuantity(product.id))}
          onAddToCart={() => handleAddToCart(product.id)}
          paymentNote={product.paymentNote}
        />
      </section>

      <Characteristics items={product.specifications} />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Похожие товары</h2>
          {ui.searchQuery ? (
            <p className={styles.sectionMeta}>
              По запросу "{ui.searchQuery}" найдено: {visibleSimilarProducts.length}
            </p>
          ) : null}
        </div>

        {visibleSimilarProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {visibleSimilarProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                quantity={ui.quantities[item.id] ?? 1}
                onIncrement={() => dispatch(incrementQuantity(item.id))}
                onDecrement={() => dispatch(decrementQuantity(item.id))}
                onAddToCart={() => handleAddToCart(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            Ничего не найдено. Попробуйте изменить запрос в строке поиска.
          </div>
        )}
      </section>

      <BrandsStrip brands={catalog.brands} />
    </>
  );
}

export default ProductPage;
