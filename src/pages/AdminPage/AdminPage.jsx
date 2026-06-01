import { useEffect, useMemo, useState } from "react";
import {
  addAdminPromotionProductApi,
  adminLoginApi,
  adminLogoutApi,
  adminRefreshApi,
  createAdminBrandApi,
  createAdminCategoryApi,
  createAdminProductApi,
  createAdminProductAttributeApi,
  createAdminProductImageApi,
  createAdminPromotionApi,
  deleteAdminBrandApi,
  deleteAdminCategoryApi,
  deleteAdminProductApi,
  deleteAdminProductAttributeApi,
  deleteAdminProductImageApi,
  deleteAdminPromotionApi,
  deleteAdminPromotionProductApi,
  fetchAdminBrandsApi,
  fetchAdminCategoriesApi,
  fetchAdminOrdersApi,
  fetchAdminProductsApi,
  fetchAdminPromotionsApi,
  updateAdminBrandApi,
  updateAdminCategoryApi,
  updateAdminOrderStatusApi,
  updateAdminProductApi,
  updateAdminProductAttributeApi,
  updateAdminProductImageApi,
  updateAdminPromotionApi,
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

const emptyImage = {
  image_url: "",
  is_main: false,
};

const emptyAttribute = {
  name: "",
  value: "",
};

const emptyNamedEntity = {
  name: "",
};

const emptyPromotion = {
  name: "",
  description: "",
  discount: "",
  start_date: "",
  end_date: "",
};

const tabs = [
  { id: "products", label: "Товары" },
  { id: "categories", label: "Категории" },
  { id: "brands", label: "Бренды" },
  { id: "promotions", label: "Акции" },
  { id: "orders", label: "Заказы" },
];

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
  category_id: String(product.category_id ?? ""),
  brand_id: String(product.brand_id ?? ""),
  name: product.name ?? "",
  sku: product.sku ?? "",
  description: product.description ?? "",
  price: String(product.price ?? ""),
  stock_qty: String(product.stock_qty ?? ""),
  rating: String(product.rating ?? "0"),
  availability_status: product.availability_status ?? "in_stock",
  publication_status: product.publication_status ?? "published",
});

const toPromotionForm = (promotion) => ({
  name: promotion.name ?? "",
  description: promotion.description ?? "",
  discount: String(promotion.discount ?? ""),
  start_date: promotion.start_date ?? "",
  end_date: promotion.end_date ?? "",
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

const toPromotionPayload = (form) => ({
  name: form.name.trim(),
  description: form.description.trim(),
  discount: Number(form.discount),
  start_date: form.start_date,
  end_date: form.end_date,
});

const formatCurrency = (value) => `${Number(value ?? 0).toLocaleString("ru-RU")} ₽`;

const getProductTitle = (product) =>
  product ? `${product.name} (${product.sku})` : "Товар не найден";

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [credentials, setCredentials] = useState({ username: "admin", password: "" });
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [imageForm, setImageForm] = useState(emptyImage);
  const [attributeForm, setAttributeForm] = useState(emptyAttribute);
  const [categoryForm, setCategoryForm] = useState(emptyNamedEntity);
  const [brandForm, setBrandForm] = useState(emptyNamedEntity);
  const [promotionForm, setPromotionForm] = useState(emptyPromotion);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [promotionProductDrafts, setPromotionProductDrafts] = useState({});
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

  const selectedProduct = useMemo(
    () => products.find((product) => product.product_id === editingProductId) ?? null,
    [editingProductId, products],
  );

  const loadAdminData = async (activeToken = token) => {
    if (!activeToken) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [productsData, ordersData, categoriesData, brandsData, promotionsData] =
        await Promise.all([
          fetchAdminProductsApi(activeToken),
          fetchAdminOrdersApi(activeToken),
          fetchAdminCategoriesApi(activeToken),
          fetchAdminBrandsApi(activeToken),
          fetchAdminPromotionsApi(activeToken),
        ]);

      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      setBrands(brandsData);
      setPromotions(promotionsData);
      setStatusDrafts(
        Object.fromEntries(ordersData.map((order) => [order.order_id, order.status])),
      );
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401 || requestError.message.toLowerCase().includes("токен")) {
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

  const clearMessages = () => {
    setError("");
    setNotice("");
  };

  const resetProductInnerForms = () => {
    setImageForm(emptyImage);
    setAttributeForm(emptyAttribute);
    setEditingImageId(null);
    setEditingAttributeId(null);
  };

  const resetProductForm = () => {
    setProductForm(emptyProduct);
    setEditingProductId(null);
    resetProductInnerForms();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    clearMessages();

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
      setCategories([]);
      setBrands([]);
      setPromotions([]);
      setNotice("Вы вышли из панели администратора.");
    }
  };

  const handleProductChange = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditProduct = (product) => {
    setActiveTab("products");
    setEditingProductId(product.product_id);
    setProductForm(toProductForm(product));
    resetProductInnerForms();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      const payload = toProductPayload(productForm);
      if (Number.isNaN(payload.price) || Number.isNaN(payload.rating)) {
        throw new Error("Цена и рейтинг должны быть числами. Можно использовать точку или запятую.");
      }

      if (editingProductId) {
        const updatedProduct = await updateAdminProductApi(token, editingProductId, payload);
        setProductForm(toProductForm(updatedProduct));
        setNotice("Товар обновлен.");
      } else {
        const createdProduct = await createAdminProductApi(token, payload);
        setEditingProductId(createdProduct.product_id);
        setProductForm(toProductForm(createdProduct));
        setNotice("Товар добавлен. Теперь можно добавить изображения и характеристики.");
      }

      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Удалить товар?")) {
      return;
    }

    clearMessages();

    try {
      await deleteAdminProductApi(token, productId);
      if (editingProductId === productId) {
        resetProductForm();
      }
      setNotice("Товар удален.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSubmitImage = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!editingProductId) {
      setError("Сначала создайте или выберите товар.");
      return;
    }

    const payload = {
      image_url: imageForm.image_url.trim(),
      is_main: Boolean(imageForm.is_main),
    };

    try {
      if (editingImageId) {
        await updateAdminProductImageApi(token, editingProductId, editingImageId, payload);
        setNotice("Изображение обновлено.");
      } else {
        await createAdminProductImageApi(token, editingProductId, payload);
        setNotice("Изображение добавлено.");
      }
      setImageForm(emptyImage);
      setEditingImageId(null);
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleEditImage = (image) => {
    setEditingImageId(image.image_id);
    setImageForm({
      image_url: image.image_url ?? "",
      is_main: Boolean(image.is_main),
    });
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Удалить изображение?")) {
      return;
    }

    clearMessages();

    try {
      await deleteAdminProductImageApi(token, editingProductId, imageId);
      if (editingImageId === imageId) {
        setEditingImageId(null);
        setImageForm(emptyImage);
      }
      setNotice("Изображение удалено.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSubmitAttribute = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!editingProductId) {
      setError("Сначала создайте или выберите товар.");
      return;
    }

    const payload = {
      name: attributeForm.name.trim(),
      value: attributeForm.value.trim(),
    };

    try {
      if (editingAttributeId) {
        await updateAdminProductAttributeApi(
          token,
          editingProductId,
          editingAttributeId,
          payload,
        );
        setNotice("Характеристика обновлена.");
      } else {
        await createAdminProductAttributeApi(token, editingProductId, payload);
        setNotice("Характеристика добавлена.");
      }
      setAttributeForm(emptyAttribute);
      setEditingAttributeId(null);
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleEditAttribute = (attribute) => {
    setEditingAttributeId(attribute.attribute_id);
    setAttributeForm({
      name: attribute.name ?? "",
      value: attribute.value ?? "",
    });
  };

  const handleDeleteAttribute = async (attributeId) => {
    if (!window.confirm("Удалить характеристику?")) {
      return;
    }

    clearMessages();

    try {
      await deleteAdminProductAttributeApi(token, editingProductId, attributeId);
      if (editingAttributeId === attributeId) {
        setEditingAttributeId(null);
        setAttributeForm(emptyAttribute);
      }
      setNotice("Характеристика удалена.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSubmitCategory = async (event) => {
    event.preventDefault();
    clearMessages();

    const payload = { name: categoryForm.name.trim() };

    try {
      if (editingCategoryId) {
        await updateAdminCategoryApi(token, editingCategoryId, payload);
        setNotice("Категория обновлена.");
      } else {
        await createAdminCategoryApi(token, payload);
        setNotice("Категория добавлена.");
      }
      setCategoryForm(emptyNamedEntity);
      setEditingCategoryId(null);
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Удалить категорию?")) {
      return;
    }

    clearMessages();

    try {
      await deleteAdminCategoryApi(token, categoryId);
      setNotice("Категория удалена.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSubmitBrand = async (event) => {
    event.preventDefault();
    clearMessages();

    const payload = { name: brandForm.name.trim() };

    try {
      if (editingBrandId) {
        await updateAdminBrandApi(token, editingBrandId, payload);
        setNotice("Бренд обновлен.");
      } else {
        await createAdminBrandApi(token, payload);
        setNotice("Бренд добавлен.");
      }
      setBrandForm(emptyNamedEntity);
      setEditingBrandId(null);
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Удалить бренд?")) {
      return;
    }

    clearMessages();

    try {
      await deleteAdminBrandApi(token, brandId);
      setNotice("Бренд удален.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleSubmitPromotion = async (event) => {
    event.preventDefault();
    clearMessages();

    const payload = toPromotionPayload(promotionForm);

    try {
      if (Number.isNaN(payload.discount)) {
        throw new Error("Скидка должна быть числом от 0 до 100.");
      }

      if (editingPromotionId) {
        await updateAdminPromotionApi(token, editingPromotionId, payload);
        setNotice("Акция обновлена.");
      } else {
        await createAdminPromotionApi(token, payload);
        setNotice("Акция добавлена.");
      }
      setPromotionForm(emptyPromotion);
      setEditingPromotionId(null);
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeletePromotion = async (promoId) => {
    if (!window.confirm("Удалить акцию?")) {
      return;
    }

    clearMessages();

    try {
      await deleteAdminPromotionApi(token, promoId);
      setNotice("Акция удалена.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const getPromotionProducts = (promoId) =>
    products.filter((product) =>
      product.promotions?.some((promotion) => promotion.promo_id === promoId),
    );

  const handleAddPromotionProduct = async (promoId) => {
    clearMessages();

    const productId = Number(promotionProductDrafts[promoId]);
    if (!productId) {
      setError("Выберите товар для акции.");
      return;
    }

    try {
      await addAdminPromotionProductApi(token, promoId, { product_id: productId });
      setPromotionProductDrafts((current) => ({ ...current, [promoId]: "" }));
      setNotice("Товар добавлен в акцию.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleRemovePromotionProduct = async (promoId, productId) => {
    clearMessages();

    try {
      await deleteAdminPromotionProductApi(token, promoId, productId);
      setNotice("Товар удален из акции.");
      await loadAdminData(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleStatusChange = async (orderId) => {
    clearMessages();

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
            <p className={styles.eyebrow}>Панель управления</p>
            <h1>Проверка сессии</h1>
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
          <span>Категории</span>
          <strong>{categories.length}</strong>
        </div>
        <div>
          <span>Акции</span>
          <strong>{promotions.length}</strong>
        </div>
        <div>
          <span>Заказы</span>
          <strong>{orders.length}</strong>
        </div>
        <div>
          <span>Выручка</span>
          <strong>{formatCurrency(totalRevenue)}</strong>
        </div>
      </section>

      <nav className={styles.tabs} aria-label="Разделы админки">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? styles.activeTab : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {error ? <div className={styles.error}>{error}</div> : null}
      {notice ? <div className={styles.notice}>{notice}</div> : null}
      {isLoading ? <div className={styles.notice}>Загрузка данных...</div> : null}

      {activeTab === "products" ? (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Каталог</p>
                <h2>{editingProductId ? "Редактирование товара" : "Новый товар"}</h2>
              </div>
              {editingProductId ? (
                <button type="button" className={styles.secondaryButton} onClick={resetProductForm}>
                  Новый товар
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
                  onChange={(event) =>
                    handleProductChange("availability_status", event.target.value)
                  }
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
                  onChange={(event) =>
                    handleProductChange("publication_status", event.target.value)
                  }
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
              <div className={styles.formActions}>
                <button type="submit">
                  {editingProductId ? "Сохранить товар" : "Добавить товар"}
                </button>
              </div>
            </form>
          </section>

          {editingProductId ? (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.eyebrow}>Дополнительные данные товара</p>
                  <h2>{selectedProduct ? selectedProduct.name : "Изображения и характеристики"}</h2>
                </div>
              </div>

              <div className={styles.productDetailsGrid}>
                <div className={styles.innerPanel}>
                  <h3>Изображения</h3>
                  <form className={styles.compactForm} onSubmit={handleSubmitImage}>
                    <label className={styles.wideField}>
                      URL изображения
                      <input
                        required
                        value={imageForm.image_url}
                        onChange={(event) =>
                          setImageForm((current) => ({
                            ...current,
                            image_url: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className={styles.checkField}>
                      <input
                        type="checkbox"
                        checked={imageForm.is_main}
                        onChange={(event) =>
                          setImageForm((current) => ({
                            ...current,
                            is_main: event.target.checked,
                          }))
                        }
                      />
                      Главное изображение
                    </label>
                    <div className={styles.formActions}>
                      <button type="submit">
                        {editingImageId ? "Сохранить изображение" : "Добавить изображение"}
                      </button>
                      {editingImageId ? (
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => {
                            setEditingImageId(null);
                            setImageForm(emptyImage);
                          }}
                        >
                          Отменить
                        </button>
                      ) : null}
                    </div>
                  </form>

                  <div className={styles.stackList}>
                    {(selectedProduct?.images ?? []).map((image) => (
                      <div className={styles.mediaRow} key={image.image_id}>
                        <img src={image.image_url} alt="" />
                        <div>
                          <strong>{image.is_main ? "Главное" : "Дополнительное"}</strong>
                          <span>{image.image_url}</span>
                        </div>
                        <div className={styles.actions}>
                          <button type="button" onClick={() => handleEditImage(image)}>
                            Изменить
                          </button>
                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => handleDeleteImage(image.image_id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                    {selectedProduct?.images?.length ? null : (
                      <p className={styles.emptyText}>Изображения пока не добавлены.</p>
                    )}
                  </div>
                </div>

                <div className={styles.innerPanel}>
                  <h3>Характеристики</h3>
                  <form className={styles.compactForm} onSubmit={handleSubmitAttribute}>
                    <label>
                      Название
                      <input
                        required
                        value={attributeForm.name}
                        onChange={(event) =>
                          setAttributeForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Значение
                      <input
                        required
                        value={attributeForm.value}
                        onChange={(event) =>
                          setAttributeForm((current) => ({
                            ...current,
                            value: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className={styles.formActions}>
                      <button type="submit">
                        {editingAttributeId ? "Сохранить характеристику" : "Добавить характеристику"}
                      </button>
                      {editingAttributeId ? (
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => {
                            setEditingAttributeId(null);
                            setAttributeForm(emptyAttribute);
                          }}
                        >
                          Отменить
                        </button>
                      ) : null}
                    </div>
                  </form>

                  <div className={styles.stackList}>
                    {(selectedProduct?.attributes ?? []).map((attribute) => (
                      <div className={styles.textRow} key={attribute.attribute_id}>
                        <div>
                          <strong>{attribute.name}</strong>
                          <span>{attribute.value}</span>
                        </div>
                        <div className={styles.actions}>
                          <button type="button" onClick={() => handleEditAttribute(attribute)}>
                            Изменить
                          </button>
                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => handleDeleteAttribute(attribute.attribute_id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                    {selectedProduct?.attributes?.length ? null : (
                      <p className={styles.emptyText}>Характеристики пока не добавлены.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

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
                    <th>Характеристики</th>
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
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.stock_qty}</td>
                      <td>{product.attributes?.length ?? 0}</td>
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
                  {products.length ? null : (
                    <tr>
                      <td colSpan="10">Товары пока не добавлены.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "categories" ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Каталог</p>
              <h2>{editingCategoryId ? "Редактирование категории" : "Новая категория"}</h2>
            </div>
          </div>
          <form className={styles.inlineForm} onSubmit={handleSubmitCategory}>
            <label>
              Название
              <input
                required
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ name: event.target.value })}
              />
            </label>
            <div className={styles.formActions}>
              <button type="submit">
                {editingCategoryId ? "Сохранить категорию" : "Добавить категорию"}
              </button>
              {editingCategoryId ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryForm(emptyNamedEntity);
                  }}
                >
                  Отменить
                </button>
              ) : null}
            </div>
          </form>
          <div className={styles.tableWrap}>
            <table className={styles.compactTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Товаров</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.category_id}>
                    <td>{category.category_id}</td>
                    <td>{category.name}</td>
                    <td>
                      {products.filter((product) => product.category_id === category.category_id)
                        .length}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(category.category_id);
                            setCategoryForm({ name: category.name });
                          }}
                        >
                          Изменить
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => handleDeleteCategory(category.category_id)}
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
      ) : null}

      {activeTab === "brands" ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Каталог</p>
              <h2>{editingBrandId ? "Редактирование бренда" : "Новый бренд"}</h2>
            </div>
          </div>
          <form className={styles.inlineForm} onSubmit={handleSubmitBrand}>
            <label>
              Название
              <input
                required
                value={brandForm.name}
                onChange={(event) => setBrandForm({ name: event.target.value })}
              />
            </label>
            <div className={styles.formActions}>
              <button type="submit">
                {editingBrandId ? "Сохранить бренд" : "Добавить бренд"}
              </button>
              {editingBrandId ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setEditingBrandId(null);
                    setBrandForm(emptyNamedEntity);
                  }}
                >
                  Отменить
                </button>
              ) : null}
            </div>
          </form>
          <div className={styles.tableWrap}>
            <table className={styles.compactTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Товаров</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.brand_id}>
                    <td>{brand.brand_id}</td>
                    <td>{brand.name}</td>
                    <td>{products.filter((product) => product.brand_id === brand.brand_id).length}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBrandId(brand.brand_id);
                            setBrandForm({ name: brand.name });
                          }}
                        >
                          Изменить
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => handleDeleteBrand(brand.brand_id)}
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
      ) : null}

      {activeTab === "promotions" ? (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Маркетинг</p>
                <h2>{editingPromotionId ? "Редактирование акции" : "Новая акция"}</h2>
              </div>
            </div>
            <form className={styles.productForm} onSubmit={handleSubmitPromotion}>
              <label>
                Название
                <input
                  required
                  value={promotionForm.name}
                  onChange={(event) =>
                    setPromotionForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>
              <label>
                Скидка, %
                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  value={promotionForm.discount}
                  onChange={(event) =>
                    setPromotionForm((current) => ({ ...current, discount: event.target.value }))
                  }
                />
              </label>
              <label>
                Начало
                <input
                  required
                  type="date"
                  value={promotionForm.start_date}
                  onChange={(event) =>
                    setPromotionForm((current) => ({ ...current, start_date: event.target.value }))
                  }
                />
              </label>
              <label>
                Окончание
                <input
                  required
                  type="date"
                  value={promotionForm.end_date}
                  onChange={(event) =>
                    setPromotionForm((current) => ({ ...current, end_date: event.target.value }))
                  }
                />
              </label>
              <label className={styles.wideField}>
                Описание
                <textarea
                  required
                  value={promotionForm.description}
                  onChange={(event) =>
                    setPromotionForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <div className={styles.formActions}>
                <button type="submit">
                  {editingPromotionId ? "Сохранить акцию" : "Добавить акцию"}
                </button>
                {editingPromotionId ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setEditingPromotionId(null);
                      setPromotionForm(emptyPromotion);
                    }}
                  >
                    Отменить
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Маркетинг</p>
                <h2>Акции</h2>
              </div>
            </div>
            <div className={styles.stackList}>
              {promotions.map((promotion) => {
                const linkedProducts = getPromotionProducts(promotion.promo_id);

                return (
                  <article className={styles.promotionRow} key={promotion.promo_id}>
                    <div>
                      <strong>{promotion.name}</strong>
                      <span>
                        {promotion.discount}% / {promotion.start_date} - {promotion.end_date}
                      </span>
                      <p>{promotion.description}</p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPromotionId(promotion.promo_id);
                          setPromotionForm(toPromotionForm(promotion));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => handleDeletePromotion(promotion.promo_id)}
                      >
                        Удалить
                      </button>
                    </div>
                    <div className={styles.promotionProducts}>
                      <label>
                        Добавить товар в акцию
                        <select
                          value={promotionProductDrafts[promotion.promo_id] ?? ""}
                          onChange={(event) =>
                            setPromotionProductDrafts((current) => ({
                              ...current,
                              [promotion.promo_id]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Выберите товар</option>
                          {products.map((product) => (
                            <option key={product.product_id} value={product.product_id}>
                              {getProductTitle(product)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddPromotionProduct(promotion.promo_id)}
                      >
                        Привязать
                      </button>
                    </div>
                    <div className={styles.tags}>
                      {linkedProducts.map((product) => (
                        <span key={product.product_id}>
                          {product.name}
                          <button
                            type="button"
                            aria-label={`Удалить ${product.name} из акции`}
                            onClick={() =>
                              handleRemovePromotionProduct(promotion.promo_id, product.product_id)
                            }
                          >
                            x
                          </button>
                        </span>
                      ))}
                      {linkedProducts.length ? null : <em>Товары не привязаны</em>}
                    </div>
                  </article>
                );
              })}
              {promotions.length ? null : <p className={styles.emptyText}>Акции пока не добавлены.</p>}
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "orders" ? (
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
                    <td>{formatCurrency(order.total_price)}</td>
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
                {orders.length ? null : (
                  <tr>
                    <td colSpan="6">Заказов пока нет.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default AdminPage;
