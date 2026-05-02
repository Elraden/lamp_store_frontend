import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import styles from "./CheckoutPage.module.css";

function CheckoutPage() {
  const items = useSelector((state) => state.cart.items);

  return (
    <>
      <Breadcrumbs items={["Каталог", "Корзина", "Оформление заказа"]} />
      <h1 className={styles.title}>Оформление заказа</h1>

      <div className={styles.checkoutLayout}>
        <form className={styles.form}>
          <section className={styles.panel}>
            <h2>Контактные данные</h2>
            <div className={styles.twoColumns}>
              <label>
                <span>ФИО</span>
                <input type="text" placeholder="Иван Иванов" aria-label="ФИО" />
              </label>
              <label>
                <span>Телефон</span>
                <input type="tel" placeholder="+7 (999) 123-45-67" aria-label="Телефон" />
              </label>
              <label className={styles.fullWidth}>
                <span>Email</span>
                <input type="email" placeholder="ivan@mail.ru" aria-label="Email" />
              </label>
            </div>
          </section>

          <section className={styles.panel}>
            <h2>Адрес доставки</h2>
            <div className={styles.stack}>
              <label>
                <span>Город</span>
                <input type="text" placeholder="Москва" aria-label="Город" />
              </label>
              <label>
                <span>Адрес</span>
                <input type="text" placeholder="ул. Примерная, д. 10, кв. 5" aria-label="Адрес" />
              </label>
              <div className={styles.threeColumns}>
                <label>
                  <span>Подъезд</span>
                  <input type="text" placeholder="1" aria-label="Подъезд" />
                </label>
                <label>
                  <span>Этаж</span>
                  <input type="text" placeholder="5" aria-label="Этаж" />
                </label>
                <label>
                  <span>Домофон</span>
                  <input type="text" placeholder="55" aria-label="Домофон" />
                </label>
              </div>
              <label>
                <span>Комментарий для курьера</span>
                <input
                  type="text"
                  placeholder="Позвонить за 30 минут"
                  aria-label="Комментарий для курьера"
                />
              </label>
            </div>
            <p>
              Доставка осуществляется подрядчиком. Срок и детали согласовываются после
              подтверждения заказа.
            </p>
          </section>

          <section className={styles.panel}>
            <h2>Оплата</h2>
            <div className={styles.twoColumns}>
              <label className={styles.option}>
                <input type="radio" name="payment" defaultChecked />
                <span>Оплата курьеру при получении</span>
              </label>
              <label className={styles.option}>
                <input type="radio" name="payment" />
                <span>Для юрлиц: оплата по согласованию</span>
              </label>
            </div>
          </section>

          <section className={styles.panel}>
            <h2>Подтверждение</h2>
            <label className={styles.consent}>
              <input type="checkbox" defaultChecked />
              <span>Согласие на обработку данных</span>
            </label>
            <Link className={styles.submitButton} to="/checkout/success">
              Подтвердить заказ
            </Link>
          </section>
        </form>

        <CheckoutSummary items={items} />
      </div>
    </>
  );
}

export default CheckoutPage;
