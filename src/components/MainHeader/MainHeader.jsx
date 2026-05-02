import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCartShopping,
  faCircleInfo,
  faHeart,
  faHeadset,
  faMagnifyingGlass,
  faPercent,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import styles from "./MainHeader.module.css";

const navConfig = {
  Каталог: { to: "/", icon: faBagShopping, end: true },
  Акции: { to: "/sales", icon: faPercent },
  "О нас": { to: "/about", icon: faCircleInfo },
  "Оплата и доставка": { to: "/checkout", icon: faTruckFast },
  Контакты: { to: "/contacts", icon: faHeadset },
};

function MainHeader({ navLinks, favoriteCount, cartCount, searchQuery, onSearchChange }) {
  return (
    <header className={styles.header}>
      <NavLink className={styles.logoBox} to="/" aria-label="Bulb Fiction">
        <img className={styles.logoImage} src="/bulb_logo.png" alt="Bulb Fiction" />
      </NavLink>

      <nav className={styles.navigation} aria-label="Основная навигация">
        {navLinks.map((item) => {
          const config = navConfig[item] ?? navConfig["Каталог"];

          return (
            <NavLink
              key={item}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeNavLink : ""}`
              }
              end={config.end}
              to={config.to}
            >
              <FontAwesomeIcon icon={config.icon} />
              <span>{item}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.searchArea}>
        <FontAwesomeIcon className={styles.searchIcon} icon={faMagnifyingGlass} />
        <input
          className={styles.searchInput}
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Поиск"
          aria-label="Поиск товаров"
        />
      </div>

      <div className={styles.metaLinks}>
        <NavLink to="/favorites">
          <FontAwesomeIcon icon={faHeart} />
          <span>Избранное ({favoriteCount})</span>
        </NavLink>
        <NavLink to="/cart">
          <FontAwesomeIcon icon={faCartShopping} />
          <span>Корзина ({cartCount})</span>
        </NavLink>
      </div>
    </header>
  );
}

export default MainHeader;
