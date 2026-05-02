import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import styles from "./AboutPage.module.css";

function AboutPage() {
  const { brands } = useSelector((state) => state.catalog);

  return (
    <>
      <Breadcrumbs items={["Каталог", "О нас"]} />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>ЛайтМаркет</p>
        <h1>Магазин лампочек для дома, офиса и улицы</h1>
        <p>
          Мы помогаем быстро подобрать свет под конкретную задачу: от простой лампочки
          E27 до декоративных решений и умного освещения.
        </p>
      </section>

      <div className={styles.grid}>
        <article>
          <h2>Что продаем</h2>
          <p>
            Светодиодные, галогенные, энергосберегающие, декоративные, уличные и умные
            лампочки. Каталог разбит по типу и цоколю, чтобы товар было легко найти.
          </p>
        </article>
        <article>
          <h2>Как работаем</h2>
          <p>
            После заказа менеджер проверяет наличие, подтверждает детали и передает
            доставку подрядчику. Оплату можно внести курьеру при получении.
          </p>
        </article>
      </div>

      <section className={styles.brandsSection}>
        <h2>Бренды</h2>
        <div className={styles.brands}>
          {brands.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutPage;
