import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLocationDot, faPhone, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import styles from "./TopBar.module.css";

function TopBar({ city, phone, workingHours }) {
  return (
    <section className={styles.topBar}>
      <p className={styles.meta}>
        <FontAwesomeIcon icon={faLocationDot} />
        <span>Ваш город: {city}</span>
      </p>
      <a className={styles.phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
        <FontAwesomeIcon icon={faPhone} />
        <span>{phone}</span>
      </a>
      <button className={styles.callbackButton} type="button">
        <FontAwesomeIcon icon={faPhoneVolume} />
        <span>Заказать звонок</span>
      </button>
      <p className={styles.meta}>
        <FontAwesomeIcon icon={faClock} />
        <span>Часы работы: {workingHours}</span>
      </p>
    </section>
  );
}

export default TopBar;
