import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  DECREMENT_QUANTITY,
  INCREMENT_CART_ITEM,
  INCREMENT_QUANTITY,
  REMOVE_CART_ITEM,
  SET_ACTIVE_CATEGORY,
  SET_ACTIVE_IMAGE,
  SET_SEARCH_QUERY,
  TOGGLE_FAVORITE,
} from "./actionTypes";

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

export const addToCart = (productId, quantity) => ({
  type: ADD_TO_CART,
  payload: {
    productId,
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

export const toggleFavorite = (productId) => ({
  type: TOGGLE_FAVORITE,
  payload: productId,
});
