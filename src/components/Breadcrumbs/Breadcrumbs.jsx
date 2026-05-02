import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

const pathByTitle = {
  Каталог: "/",
  Акции: "/sales",
  "О нас": "/about",
  Контакты: "/contacts",
  Корзина: "/cart",
  Избранное: "/favorites",
  "Оформление заказа": "/checkout",
  Подтверждение: "/checkout/success",
};

function Breadcrumbs({ items }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const path = pathByTitle[item];

        return (
          <span key={`${item}-${index}`} className={styles.crumb}>
            {!isLast && path ? <Link to={path}>{item}</Link> : <span>{item}</span>}
            {!isLast ? <span className={styles.separator}>&gt;</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
