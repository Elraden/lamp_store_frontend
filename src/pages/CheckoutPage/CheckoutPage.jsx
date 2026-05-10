import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import { createOrder } from "../../store/actions";
import styles from "./CheckoutPage.module.css";

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  entrance: "",
  floor: "",
  intercom: "",
  comment: "",
  consent: true,
};

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const { error, isSubmitting } = useSelector((state) => state.orders);
  const [form, setForm] = useState(initialForm);
  const [stockError, setStockError] = useState("");

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const updateField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const buildDeliveryAddress = () =>
    [
      form.city,
      form.address,
      form.entrance ? `подъезд ${form.entrance}` : "",
      form.floor ? `этаж ${form.floor}` : "",
      form.intercom ? `домофон ${form.intercom}` : "",
    ]
      .filter(Boolean)
      .join(", ");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStockError("");

    const unavailableItem = items.find((item) => item.quantity > item.stock);

    if (unavailableItem) {
      setStockError(
        `Недостаточно товара "${unavailableItem.title}" на складе. Доступно: ${unavailableItem.stock} шт.`,
      );
      return;
    }

    const orderPayload = {
      customer_name: form.customerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      delivery_address: buildDeliveryAddress(),
      comment: form.comment.trim() || null,
      items: items.map((item) => ({
        product_id: Number(item.id),
        qty: item.quantity,
      })),
    };

    await dispatch(createOrder(orderPayload, items));
    navigate("/checkout/success");
  };

  return (
    <>
      <Breadcrumbs items={["Каталог", "Корзина", "Оформление заказа"]} />
      <h1 className={styles.title}>Оформление заказа</h1>

      <div className={styles.checkoutLayout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.panel}>
            <h2>Контактные данные</h2>
            <div className={styles.twoColumns}>
              <label>
                <span>ФИО</span>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={updateField("customerName")}
                  placeholder="Иван Иванов"
                  required
                />
              </label>
              <label>
                <span>Телефон</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField("phone")}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </label>
              <label className={styles.fullWidth}>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="ivan@mail.ru"
                  required
                />
              </label>
            </div>
          </section>

          <section className={styles.panel}>
            <h2>Адрес доставки</h2>
            <div className={styles.stack}>
              <label>
                <span>Город</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={updateField("city")}
                  placeholder="Москва"
                  required
                />
              </label>
              <label>
                <span>Адрес</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={updateField("address")}
                  placeholder="ул. Примерная, д. 10, кв. 5"
                  required
                />
              </label>
              <div className={styles.threeColumns}>
                <label>
                  <span>Подъезд</span>
                  <input type="text" value={form.entrance} onChange={updateField("entrance")} />
                </label>
                <label>
                  <span>Этаж</span>
                  <input type="text" value={form.floor} onChange={updateField("floor")} />
                </label>
                <label>
                  <span>Домофон</span>
                  <input type="text" value={form.intercom} onChange={updateField("intercom")} />
                </label>
              </div>
              <label>
                <span>Комментарий для курьера</span>
                <input
                  type="text"
                  value={form.comment}
                  onChange={updateField("comment")}
                  placeholder="Позвонить за 30 минут"
                />
              </label>
            </div>
            <p>
              Доставка осуществляется подрядчиком. Срок и детали согласуются после подтверждения
              заказа.
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
              <input
                type="checkbox"
                checked={form.consent}
                onChange={updateField("consent")}
                required
              />
              <span>Согласие на обработку данных</span>
            </label>
            {stockError ? <p className={styles.errorText}>{stockError}</p> : null}
            {error ? <p className={styles.errorText}>{error}</p> : null}
            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Отправляем..." : "Подтвердить заказ"}
            </button>
          </section>
        </form>

        <CheckoutSummary items={items} />
      </div>
    </>
  );
}

export default CheckoutPage;
