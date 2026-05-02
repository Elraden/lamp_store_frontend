import {
  ADD_TO_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  REMOVE_CART_ITEM,
} from "../actionTypes";
import { catalogData } from "../../mocks/catalog";

const productsById = [
  catalogData.product,
  ...catalogData.similarProducts,
  ...catalogData.catalogProducts,
  ...catalogData.checkoutItems,
].reduce((accumulator, product) => {
  accumulator[product.id] = product;
  return accumulator;
}, {});

const calculateTotalCount = (items) =>
  items.reduce((total, item) => total + item.quantity, 0);

const buildState = (items) => ({
  items,
  totalCount: calculateTotalCount(items),
});

const initialState = buildState(catalogData.checkoutItems);

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { productId, quantity } = action.payload;
      const safeQuantity = Math.max(1, quantity);
      const existingItem = state.items.find((item) => item.id === productId);

      if (existingItem) {
        return buildState(
          state.items.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + safeQuantity } : item,
          ),
        );
      }

      const product = productsById[productId];

      if (!product) {
        return state;
      }

      return buildState([...state.items, { ...product, quantity: safeQuantity }]);
    }

    case INCREMENT_CART_ITEM:
      return buildState(
        state.items.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );

    case DECREMENT_CART_ITEM:
      return buildState(
        state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        ),
      );

    case REMOVE_CART_ITEM:
      return buildState(state.items.filter((item) => item.id !== action.payload));

    default:
      return state;
  }
};

export default cartReducer;
