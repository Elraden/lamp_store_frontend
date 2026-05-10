import {
  ADD_TO_CART,
  CLEAR_CART,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  DECREMENT_CART_ITEM,
  DECREMENT_QUANTITY,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  INCREMENT_CART_ITEM,
  INCREMENT_QUANTITY,
  REMOVE_CART_ITEM,
  SET_ACTIVE_CATEGORY,
  SET_ACTIVE_IMAGE,
  SET_SEARCH_QUERY,
  TOGGLE_FAVORITE,
  UPDATE_CURRENT_ORDER,
} from "./actionTypes";
import { createOrderApi, fetchOrderApi, fetchProductsApi } from "../api/shopApi";

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

export const setActiveImage = (index) => ({
  type: SET_ACTIVE_IMAGE,
  payload: index,
});

export const setActiveCategory = (category) => ({
  type: SET_ACTIVE_CATEGORY,
  payload: category,
});

export const incrementQuantity = (productId) => ({
  type: INCREMENT_QUANTITY,
  payload: productId,
});

export const decrementQuantity = (productId) => ({
  type: DECREMENT_QUANTITY,
  payload: productId,
});

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });

  try {
    const products = await fetchProductsApi();
    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: products,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.message,
    });
  }
};

export const addToCart = (product, quantity) => ({
  type: ADD_TO_CART,
  payload: {
    product,
    quantity,
  },
});

export const incrementCartItem = (productId) => ({
  type: INCREMENT_CART_ITEM,
  payload: productId,
});

export const decrementCartItem = (productId) => ({
  type: DECREMENT_CART_ITEM,
  payload: productId,
});

export const removeCartItem = (productId) => ({
  type: REMOVE_CART_ITEM,
  payload: productId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const toggleFavorite = (productId) => ({
  type: TOGGLE_FAVORITE,
  payload: productId,
});

export const createOrder = (order, cartItems = []) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const createdOrder = await createOrderApi(order);

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: {
        order: createdOrder,
        cartItems,
      },
    });
    dispatch(clearCart());
    return createdOrder;
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const refreshCurrentOrder = (orderId) => async (dispatch) => {
  const order = await fetchOrderApi(orderId);

  dispatch({
    type: UPDATE_CURRENT_ORDER,
    payload: order,
  });

  return order;
};
