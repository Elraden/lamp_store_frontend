import { useEffect, useMemo, useState } from "react";
import {
  adminLoginApi,
  adminLogoutApi,
  adminRefreshApi,
  createAdminProductApi,
  deleteAdminProductApi,
  fetchAdminBrandsApi,
  fetchAdminCategoriesApi,
  fetchAdminOrdersApi,
  fetchAdminProductsApi,
  updateAdminOrderStatusApi,
  updateAdminProductApi,
} from "../../api/shopApi";
import styles from "./AdminPage.module.css";

const TOKEN_KEY = "admin_access_token";

const emptyProduct = {
  category_id: "",
  brand_id: "",
  name: "",
  sku: "",
  description: "",
  price: "",
  stock_qty: "",
  rating: "0",
  availability_status: "in_stock",
  publication_status: "published",
};

const orderStatuses = [
  { value: "pending", label: "В обработке" },
  { value: "confirmed", label: "Подтвержден" },
  { value: "rejected", label: "Отклонен" },
  { value: "cancelled", label: "Отменен" },
];

const availabilityStatuses = [
  { value: "in_stock", label: "В наличии" },
  { value: "out_of_stock", label: "Нет в наличии" },
  { value: "preorder", label: "Предзаказ" },
  { value: "discontinued", label: "Снят с продажи" },
];

const publicationStatuses = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликован" },
  { value: "archived", label: "Архив" },
];

const toProductForm = (product) => ({
  category_id: String(product.category_id),
  brand_id: String(product.brand_id),
  name: product.name ?? "",
  sku: product.sku ?? "",
  description: product.description ?? "",
  price: String(product.price ?? ""),
  stock_qty: String(product.stock_qty ?? ""),
  rating: String(product.rating ?? "0"),
  availability_status: product.availability_status ?? "in_stock",
  publication_status: product.publication_status ?? "published",
});

const parseDecimal = (value) => Number(String(value).replace(",", "."));

const toProductPayload = (form) => ({
  category_id: Number(form.category_id),
  brand_id: Number(form.brand_id),
  name: form.name.trim(),
  sku: form.sku.trim(),
  description: form.description.trim(),
  price: parseDecimal(form.price),
  stock_qty: Number(form.stock_qty),
  rating: parseDecimal(form.rating),
  availability_status: form.availability_status,
  publication_status: form.publication_status,
});

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [credentials, setCredentials] = useState({ username: "admin", password: "" });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isAuthenticated = Boolean(token);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total_price ?? 0), 0),
    [orders],
  );

  const loadAdminData = async (activeToken = token) => {
    if (!activeToken) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [productsData, ordersData, categoriesData, brandsData] = await Promise.all([
        fetchAdminProductsApi(activeToken),
        fetchAdminOrdersApi(activeToken),
        fetchAdminCategoriesApi(activeToken),
        fetchAdminBrandsApi(activeToken),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      setBrands(brandsData);
      setStatusDrafts(
        Object.fromEntries(ordersData.map((order) => [order.order_id, order.status])),
      );
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.message.toLowerCase().includes("токен")) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  useEffect(() => {
    const handleTokenRefresh = (event) => {
      setToken(event.detail ?? localStorage.getItem(TOKEN_KEY) ?? "");
    };

    window.addEventListener("admin-token-refreshed", handleTokenRefresh);
    return () => window.removeEventListener("admin-token-refreshed", handleTokenRefresh);
  }, []);

  useEffect(() => {
    if (token) {
      return;
    }

    let isActive = true;
    setIsRestoringSession(true);
    adminRefreshApi()
      .then((result) => {
        if (isActive) {
          setToken(result.access_token);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        if (isActive) {
          setIsRestoringSession(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const result = await adminLoginApi(credentials);
      setToken(result.access_token);
      setCredentials((current) => ({ ...current, password: "" }));
      setNotice("Вход выполнен.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleLogout = async () => {
    setError("");
    try {
      await adminLogoutApi(token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setProducts([]);
      setOrders([]);
      setNotice("Вы вышли из панели администратора.");
    }
  };

  const handleProductChange = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const resetProductForm = () => {
    setProductForm(emptyProduct);
    setEditingProductId(null);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.product_id);
    setProductForm(toProductForm(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const payload = toProductPayload(productForm);
      if (Number.isNaN(payload.price) || Number.isNaN(payload.rating)) {
        throw new Error("Цена и рейтинг должны быть числами. Можно использовать точку или запятую.");
      }
      if (editingProductId) {
        await updateAdminProductApi(token, editingProductId, payload);
        setNotice("Товар обновлен.");
      } else {
        await createAdminProductApi(token, payload);
        setNotice("Товар добавлен.");
      }
      resetProductForm();
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Удалить товар?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await deleteAdminProductApi(token, productId);
      setNotice("Товар удален.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleStatusChange = async (orderId) => {
    setError("");
    setNotice("");

    try {
      await updateAdminOrderStatusApi(token, orderId, {
        status: statusDrafts[orderId],
        status_message: "Статус изменен администратором.",
      });
      setNotice(`Статус заказа #${orderId} обновлен.`);
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!isAuthenticated) {
    if (isRestoringSession) {
      return (
        <main className={styles.loginPage}>
          <div className={styles.loginPanel}>
            <p className={styles.eyebrow}>РџР°РЅРµР»СЊ СѓРїСЂР°РІР»РµРЅРёСЏ</p>
            <h1>РџСЂРѕРІРµСЂРєР° СЃРµСЃСЃРёРё</h1>
          </div>
        </main>
      );
    }

    return (
      <main className={styles.loginPage}>
        <form className={styles.loginPanel} onSubmit={handleLogin}>
          <div>
            <p className={styles.eyebrow}>Панель управления</p>
            <h1>Вход администратора</h1>
          </div>

          <label>
            Логин
            <input
              value={credentials.username}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, username: event.target.value }))
              }
              autoComplete="username"
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, password: event.target.value }))
              }
              autoComplete="current-password"
            />
          </label>

          {error ? <div className={styles.error}>{error}</div> : null}
          <button type="submit">Войти</button>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.adminPage}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Администрирование магазина</p>
          <h1>Панель управления</h1>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <section className={styles.metrics}>
        <div>
          <span>Товары</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Заказы</span>
          <strong>{orders.length}</strong>
        </div>
        <div>
          <span>Выручка</span>
          <strong>{totalRevenue.toLocaleString("ru-RU")} ₽</strong>
        </div>
      </section>

      {error ? <div className={styles.error}>{error}</div> : null}
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      {isLoading ? <div className={styles.notice}>Загрузка данных...</div> : null}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Каталог</p>
            <h2>{editingProductId ? "Редактирование товара" : "Новый товар"}</h2>
          </div>
          {editingProductId ? (
            <button type="button" className={styles.secondaryButton} onClick={resetProductForm}>
              Отменить
            </button>
          ) : null}
        </div>

        <form className={styles.productForm} onSubmit={handleSubmitProduct}>
          <label>
            Название
            <input
              required
              value={productForm.name}
              onChange={(event) => handleProductChange("name", event.target.value)}
            />
          </label>
          <label>
            SKU
            <input
              required
              value={productForm.sku}
              onChange={(event) => handleProductChange("sku", event.target.value)}
            />
          </label>
          <label>
            Категория
            <select
              required
              value={productForm.category_id}
              onChange={(event) => handleProductChange("category_id", event.target.value)}
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Бренд
            <select
              required
              value={productForm.brand_id}
              onChange={(event) => handleProductChange("brand_id", event.target.value)}
            >
              <option value="">Выберите бренд</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Цена
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(event) => handleProductChange("price", event.target.value)}
            />
          </label>
          <label>
            Остаток
            <input
              required
              type="number"
              min="0"
              value={productForm.stock_qty}
              onChange={(event) => handleProductChange("stock_qty", event.target.value)}
            />
          </label>
          <label>
            Рейтинг
            <input
              required
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={productForm.rating}
              onChange={(event) => handleProductChange("rating", event.target.value)}
            />
          </label>
          <label>
            Наличие
            <select
              value={productForm.availability_status}
              onChange={(event) => handleProductChange("availability_status", event.target.value)}
            >
              {availabilityStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Публикация
            <select
              value={productForm.publication_status}
              onChange={(event) => handleProductChange("publication_status", event.target.value)}
            >
              {publicationStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.wideField}>
            Описание
            <textarea
              required
              value={productForm.description}
              onChange={(event) => handleProductChange("description", event.target.value)}
            />
          </label>
          <button type="submit">{editingProductId ? "Сохранить товар" : "Добавить товар"}</button>
        </form>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Каталог</p>
            <h2>Товары</h2>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>SKU</th>
                <th>Категория</th>
                <th>Бренд</th>
                <th>Цена</th>
                <th>Остаток</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category?.name ?? product.category_id}</td>
                  <td>{product.brand?.name ?? product.brand_id}</td>
                  <td>{Number(product.price).toLocaleString("ru-RU")} ₽</td>
                  <td>{product.stock_qty}</td>
                  <td>{product.publication_status}</td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => handleEditProduct(product)}>
                        Изменить
                      </button>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => handleDeleteProduct(product.product_id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Продажи</p>
            <h2>Заказы</h2>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Контакты</th>
                <th>Сумма</th>
                <th>Текущий статус</th>
                <th>Новый статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>
                    <span>{order.email}</span>
                    <small>{order.phone}</small>
                  </td>
                  <td>{Number(order.total_price).toLocaleString("ru-RU")} ₽</td>
                  <td>{order.status}</td>
                  <td>
                    <div className={styles.statusControl}>
                      <select
                        value={statusDrafts[order.order_id] ?? order.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [order.order_id]: event.target.value,
                          }))
                        }
                      >
                        {orderStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleStatusChange(order.order_id)}>
                        Обновить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
