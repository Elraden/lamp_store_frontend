import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import styles from "./OrderSuccessPage.module.css";

function OrderSuccessPage() {
  const items = useSelector((state) => state.cart.items);

  return (
    <>
      <Breadcrumbs items={["Каталог", "Корзина", "Оформление заказа", "Подтверждение"]} />

      <div className={styles.successLayout}>
        <section className={styles.successPanel}>
          <h1>Заказ успешно оформлен</h1>
          <p className={styles.orderNumber}>Номер заказа: ORD-2026-00125</p>

          <div className={styles.infoBox}>
            <h2>Данные получателя</h2>
            <p>Иван Иванов</p>
            <p>+7 (999) 123-45-67</p>
            <p>ivan@mail.ru</p>
            <p>Москва, ул. Примерная, д. 10, кв. 5</p>
          </div>

          <div className={styles.infoBox}>
            <h2>Что дальше?</h2>
            <p>1. Менеджер проверит наличие лампочек.</p>
            <p>2. С вами свяжутся для подтверждения заказа.</p>
            <p>3. Заказ будет передан подрядчику по доставке.</p>
          </div>

          <div className={styles.actions}>
            <Link to="/">Вернуться в каталог</Link>
            <Link to="/#sales">Перейти к акциям</Link>
          </div>
        </section>

        <CheckoutSummary items={items} />
      </div>
    </>
  );
}

export default OrderSuccessPage;
