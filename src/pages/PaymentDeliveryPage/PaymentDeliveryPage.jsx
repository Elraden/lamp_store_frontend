import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCreditCard,
  faFileInvoice,
  faLocationDot,
  faPhoneVolume,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import styles from "./PaymentDeliveryPage.module.css";

const paymentOptions = [
  {
    icon: faCreditCard,
    title: "Оплата при получении",
    text: "Передайте оплату курьеру после проверки состава заказа и внешнего вида товаров.",
  },
  {
    icon: faFileInvoice,
    title: "Оплата для юридических лиц",
    text: "Для организаций менеджер подготовит счет после подтверждения наличия и реквизитов.",
  },
];

const deliverySteps = [
  {
    icon: faBoxOpen,
    title: "Проверяем наличие",
    text: "После оформления заказа система проверяет остатки, а менеджер уточняет детали.",
  },
  {
    icon: faPhoneVolume,
    title: "Подтверждаем заказ",
    text: "Мы связываемся с вами по телефону или email и согласуем удобный интервал.",
  },
  {
    icon: faTruckFast,
    title: "Передаем в доставку",
    text: "Заказ доставляет подрядчик. Стоимость и срок зависят от адреса и состава заказа.",
  },
];

function PaymentDeliveryPage() {
  return (
    <>
      <Breadcrumbs items={["Каталог", "Оплата и доставка"]} />

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Условия покупки</p>
          <h1>Оплата и доставка</h1>
          <p>
            Заказ можно оформить из корзины. После проверки наличия мы подтвердим товары,
            согласуем адрес, время доставки и удобный способ оплаты.
          </p>
        </div>
        <FontAwesomeIcon icon={faLocationDot} />
      </section>

      <section className={styles.section}>
        <h2>Способы оплаты</h2>
        <div className={styles.grid}>
          {paymentOptions.map((item) => (
            <article key={item.title} className={styles.card}>
              <FontAwesomeIcon icon={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Как проходит доставка</h2>
        <div className={styles.grid}>
          {deliverySteps.map((item) => (
            <article key={item.title} className={styles.card}>
              <FontAwesomeIcon icon={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default PaymentDeliveryPage;
