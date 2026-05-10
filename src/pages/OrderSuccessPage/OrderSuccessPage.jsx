import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import { refreshCurrentOrder } from "../../store/actions";
import styles from "./OrderSuccessPage.module.css";

const formatOrderItems = (items) =>
  items.map((item) => ({
    id: String(item.product_id),
    title: item.product_name ?? `Товар #${item.product_id}`,
    price: Number(item.unit_price ?? 0),
    quantity: item.qty,
  }));

const statusView = {
  pending: {
    title: "Заказ обрабатывается",
    tone: "processing",
    text: "Проверяем наличие товаров. Статус обновится автоматически.",
  },
  confirmed: {
    title: "Заказ подтвержден",
    tone: "success",
    text: "Товары зарезервированы. Менеджер свяжется для согласования доставки.",
  },
  rejected: {
    title: "Заказ не удалось подтвердить",
    tone: "danger",
    text: "Проверьте состав корзины и попробуйте оформить заказ еще раз.",
  },
};

function OrderSuccessPage() {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.currentOrder);
  const orderItems = useSelector((state) => state.orders.currentOrderItems);

  useEffect(() => {
    if (!order || order.status !== "pending") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      dispatch(refreshCurrentOrder(order.order_id));
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, [dispatch, order]);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const summaryItems = orderItems.length > 0 ? orderItems : formatOrderItems(order.items ?? []);
  const view = statusView[order.status] ?? statusView.pending;
  const statusText =
    order.status === "rejected" && order.status_message ? order.status_message : view.text;

  return (
    <>
      <Breadcrumbs items={["Каталог", "Корзина", "Оформление заказа", "Статус заказа"]} />

      <div className={styles.successLayout}>
        <section className={styles.successPanel}>
          <h1>{view.title}</h1>
          <p className={styles.orderNumber}>Номер заказа: ORD-{order.order_id}</p>

          <div className={styles.infoBox}>
            <h2>Данные получателя</h2>
            <p>{order.customer_name}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
            <p>{order.delivery_address}</p>
          </div>

          <div className={`${styles.infoBox} ${styles[view.tone]}`}>
            <h2>Статус</h2>
            <p>{statusText}</p>
          </div>

          <div className={styles.actions}>
            <Link to="/">Вернуться в каталог</Link>
            <Link to="/cart">Открыть корзину</Link>
          </div>
        </section>

        <CheckoutSummary items={summaryItems} />
      </div>
    </>
  );
}

export default OrderSuccessPage;
