import { useDispatch, useSelector } from "react-redux";
import { setActiveCategory, setSearchQuery } from "../../store/actions";
import TopBar from "../TopBar/TopBar";
import MainHeader from "../MainHeader/MainHeader";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import styles from "./CatalogLayout.module.css";

function CatalogLayout({ children }) {
  const dispatch = useDispatch();
  const catalog = useSelector((state) => state.catalog);
  const cartCount = useSelector((state) => state.cart.totalCount);
  const favoriteCount = useSelector((state) => state.favorites.ids.length);
  const searchQuery = useSelector((state) => state.ui.searchQuery);
  const activeCategory = useSelector((state) => state.ui.activeCategory);

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <TopBar city={catalog.city} phone={catalog.phone} workingHours={catalog.workingHours} />
        <MainHeader
          navLinks={catalog.navLinks}
          favoriteCount={favoriteCount}
          cartCount={cartCount}
          searchQuery={searchQuery}
          onSearchChange={(value) => dispatch(setSearchQuery(value))}
        />

        <div className={styles.contentGrid}>
          <Sidebar
            categories={catalog.categories}
            activeCategory={activeCategory}
            onCategoryChange={(category) => dispatch(setActiveCategory(category))}
          />
          <main className={styles.mainColumn}>{children}</main>
        </div>

        <Footer
          navLinks={catalog.navLinks}
          phone={catalog.phone}
          email={catalog.email}
          address={catalog.address}
          workingHours={catalog.workingHours}
        />
      </div>
    </div>
  );
}

export default CatalogLayout;
