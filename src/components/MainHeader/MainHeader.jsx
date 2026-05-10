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

const navByPosition = [
  { to: "/", icon: faBagShopping, end: true },
  { to: "/sales", icon: faPercent },
  { to: "/about", icon: faCircleInfo },
  { to: "/payment-delivery", icon: faTruckFast },
  { to: "/contacts", icon: faHeadset },
];

function MainHeader({ navLinks, favoriteCount, cartCount, searchQuery, onSearchChange }) {
  return (
    <header className={styles.header}>
      <NavLink className={styles.logoBox} to="/" aria-label="Bulb Fiction">
        <img className={styles.logoImage} src="/bulb_logo.png" alt="Bulb Fiction" />
      </NavLink>

      <nav className={styles.navigation} aria-label="Основная навигация">
        {navLinks.map((item, index) => {
          const config = navByPosition[index] ?? navByPosition[0];

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
