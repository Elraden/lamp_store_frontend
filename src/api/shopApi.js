const API_URL = import.meta.env.VITE_API_GATEWAY_URL ?? "http://localhost:8000";
const ADMIN_TOKEN_KEY = "admin_access_token";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const errorTranslations = [
  ["Input should be a valid dictionary or object to extract fields from", "Тело запроса должно быть JSON-объектом."],
  ["Field required", "Обязательное поле не заполнено."],
  ["Input should be a valid number", "Введите корректное число."],
  ["Input should be a valid integer", "Введите целое число."],
  ["Input should be greater than or equal to", "Значение меньше допустимого минимума."],
  ["Input should be less than or equal to", "Значение больше допустимого максимума."],
  ["String should have at least", "Строка слишком короткая."],
  ["String should have at most", "Строка слишком длинная."],
];

const formatFieldPath = (loc = []) =>
  loc
    .filter((part) => part !== "body")
    .map((part) => {
      const labels = {
        category_id: "категория",
        brand_id: "бренд",
        name: "название",
        sku: "SKU",
        description: "описание",
        price: "цена",
        stock_qty: "остаток",
        rating: "рейтинг",
        availability_status: "наличие",
        publication_status: "публикация",
        image_url: "URL изображения",
        is_main: "главное изображение",
        value: "значение",
        discount: "скидка",
        start_date: "дата начала",
        end_date: "дата окончания",
        product_id: "товар",
      };

      return labels[part] ?? part;
    })
    .join(".");

const translateErrorMessage = (message) => {
  const translation = errorTranslations.find(([source]) => message.includes(source));
  return translation?.[1] ?? message;
};

const request = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    credentials: options?.credentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();

    try {
      const parsed = JSON.parse(message);
      const detail = Array.isArray(parsed.detail)
        ? parsed.detail
            .map((item) => {
              const path = Array.isArray(item.loc) ? formatFieldPath(item.loc) : "";
              const translated = translateErrorMessage(item.msg ?? "");
              return path ? `${path}: ${translated}` : translated;
            })
            .join("; ")
        : translateErrorMessage(parsed.detail ?? "");

      throw new ApiError(
        typeof detail === "string" ? detail : message || `HTTP ${response.status}`,
        response.status,
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ApiError(message || `HTTP ${response.status}`, response.status);
      }

      throw error;
    }
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchProductsApi = () => request(`${API_URL}/products`);

export const createOrderApi = (payload) =>
  request(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchOrderApi = (orderId) => request(`${API_URL}/orders/${orderId}`);

const storeAdminAccessToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.dispatchEvent(new CustomEvent("admin-token-refreshed", { detail: token }));
};

export const adminRefreshApi = async () => {
  const result = await request(`${API_URL}/admin/refresh`, {
    method: "POST",
  });
  storeAdminAccessToken(result.access_token);
  return result;
};

const adminRequest = async (path, token, options) => {
  const makeRequest = (activeToken) =>
    request(`${API_URL}/admin${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${activeToken}`,
        ...(options?.headers ?? {}),
      },
    });

  try {
    return await makeRequest(token);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    const refreshed = await adminRefreshApi();
    return makeRequest(refreshed.access_token);
  }
};

export const adminLoginApi = async (payload) => {
  const result = await request(`${API_URL}/admin/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  storeAdminAccessToken(result.access_token);
  return result;
};

export const adminLogoutApi = (token) =>
  adminRequest("/logout", token, {
    method: "POST",
  }).finally(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  });

export const fetchAdminProductsApi = (token) => adminRequest("/products", token);
export const fetchAdminOrdersApi = (token) => adminRequest("/orders", token);
export const fetchAdminCategoriesApi = (token) => adminRequest("/categories", token);
export const fetchAdminBrandsApi = (token) => adminRequest("/brands", token);
export const fetchAdminPromotionsApi = (token) => adminRequest("/promotions", token);

export const createAdminProductApi = (token, payload) =>
  adminRequest("/products", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminProductApi = (token, productId, payload) =>
  adminRequest(`/products/${productId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminProductApi = (token, productId) =>
  adminRequest(`/products/${productId}`, token, {
    method: "DELETE",
  });

export const createAdminProductImageApi = (token, productId, payload) =>
  adminRequest(`/products/${productId}/images`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminProductImageApi = (token, productId, imageId, payload) =>
  adminRequest(`/products/${productId}/images/${imageId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminProductImageApi = (token, productId, imageId) =>
  adminRequest(`/products/${productId}/images/${imageId}`, token, {
    method: "DELETE",
  });

export const createAdminProductAttributeApi = (token, productId, payload) =>
  adminRequest(`/products/${productId}/attributes`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminProductAttributeApi = (token, productId, attributeId, payload) =>
  adminRequest(`/products/${productId}/attributes/${attributeId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminProductAttributeApi = (token, productId, attributeId) =>
  adminRequest(`/products/${productId}/attributes/${attributeId}`, token, {
    method: "DELETE",
  });

export const createAdminCategoryApi = (token, payload) =>
  adminRequest("/categories", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminCategoryApi = (token, categoryId, payload) =>
  adminRequest(`/categories/${categoryId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminCategoryApi = (token, categoryId) =>
  adminRequest(`/categories/${categoryId}`, token, {
    method: "DELETE",
  });

export const createAdminBrandApi = (token, payload) =>
  adminRequest("/brands", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminBrandApi = (token, brandId, payload) =>
  adminRequest(`/brands/${brandId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminBrandApi = (token, brandId) =>
  adminRequest(`/brands/${brandId}`, token, {
    method: "DELETE",
  });

export const createAdminPromotionApi = (token, payload) =>
  adminRequest("/promotions", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminPromotionApi = (token, promoId, payload) =>
  adminRequest(`/promotions/${promoId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminPromotionApi = (token, promoId) =>
  adminRequest(`/promotions/${promoId}`, token, {
    method: "DELETE",
  });

export const addAdminPromotionProductApi = (token, promoId, payload) =>
  adminRequest(`/promotions/${promoId}/products`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteAdminPromotionProductApi = (token, promoId, productId) =>
  adminRequest(`/promotions/${promoId}/products/${productId}`, token, {
    method: "DELETE",
  });

export const updateAdminOrderStatusApi = (token, orderId, payload) =>
  adminRequest(`/orders/${orderId}/status`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
