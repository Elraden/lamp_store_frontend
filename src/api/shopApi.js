const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL ?? "http://localhost:8001";
const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL ?? "http://localhost:8002";

const request = async (url, options) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();

    try {
      const parsed = JSON.parse(message);
      throw new Error(parsed.detail || message || `HTTP ${response.status}`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(message || `HTTP ${response.status}`);
      }

      throw error;
    }
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchProductsApi = () => request(`${PRODUCT_API_URL}/products`);

export const createOrderApi = (payload) =>
  request(`${ORDER_API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchOrderApi = (orderId) => request(`${ORDER_API_URL}/orders/${orderId}`);
