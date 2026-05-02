import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCircleInfo,
  faClock,
  faEnvelope,
  faLocationDot,
  faPercent,
  faPhone,
  faHeadset,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const navConfig = {
  Каталог: { to: "/", icon: faBagShopping },
  Акции: { to: "/sales", icon: faPercent },
  "О нас": { to: "/about", icon: faCircleInfo },
  "Оплата и доставка": { to: "/checkout", icon: faTruckFast },
  Контакты: { to: "/contacts", icon: faHeadset },
};

function Footer({ navLinks, phone, email, address, workingHours }) {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="Ссылки в футере">
        {navLinks.map((item) => {
          const config = navConfig[item] ?? navConfig["Каталог"];

          return (
            <Link key={item} to={config.to}>
              <FontAwesomeIcon icon={config.icon} />
              <span>{item}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.center}>
        <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
          <FontAwesomeIcon icon={faPhone} />
          <span>{phone}</span>
        </a>
        <a href={`mailto:${email}`}>
          <FontAwesomeIcon icon={faEnvelope} />
          <span>{email}</span>
        </a>
      </div>

      <div className={styles.contacts}>
        <p>
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{address}</span>
        </p>
        <p>
          <FontAwesomeIcon icon={faClock} />
          <span>Часы работы: {workingHours}</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
