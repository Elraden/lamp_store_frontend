import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faHeadset,
  faLocationDot,
  faMapLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import styles from "./ContactsPage.module.css";

const mapPoint = {
  lat: 55.7446,
  lng: 37.6068,
};

function ContactsPage() {
  const { phone, email, address, workingHours } = useSelector((state) => state.catalog);
  const mapSrc = `https://www.google.com/maps?q=${mapPoint.lat},${mapPoint.lng}&z=15&output=embed`;

  return (
    <>
      <Breadcrumbs items={["Каталог", "Контакты"]} />

      <section className={styles.hero}>
        <FontAwesomeIcon icon={faHeadset} />
        <div>
          <p>Связь с магазином</p>
          <h1>Контакты</h1>
        </div>
      </section>

      <div className={styles.cards}>
        <article>
          <FontAwesomeIcon icon={faPhone} />
          <h2>Телефон</h2>
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
        </article>
        <article>
          <FontAwesomeIcon icon={faEnvelope} />
          <h2>Email</h2>
          <a href={`mailto:${email}`}>{email}</a>
        </article>
        <article>
          <FontAwesomeIcon icon={faLocationDot} />
          <h2>Адрес</h2>
          <p>{address}</p>
        </article>
        <article>
          <FontAwesomeIcon icon={faClock} />
          <h2>Режим работы</h2>
          <p>{workingHours}</p>
        </article>
      </div>

      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <FontAwesomeIcon icon={faMapLocationDot} />
          <div>
            <h2>Мы на карте</h2>
            <p>{address}</p>
          </div>
        </div>
        <iframe
          className={styles.map}
          title="Мы на карте"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}

export default ContactsPage;
