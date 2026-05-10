import {
  ADD_TO_CART,
  CLEAR_CART,
  DECREMENT_CART_ITEM,
  INCREMENT_CART_ITEM,
  REMOVE_CART_ITEM,
} from "../actionTypes";

const calculateTotalCount = (items) =>
  items.reduce((total, item) => total + item.quantity, 0);

const buildState = (items) => ({
  items,
  totalCount: calculateTotalCount(items),
});

const getStockLimit = (item) => (Number.isFinite(item.stock) ? item.stock : Infinity);

const initialState = buildState([]);

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity } = action.payload;
      if (!product) {
        return state;
      }

      const productId = product.id;
      const stockLimit = getStockLimit(product);
      const safeQuantity = Math.min(stockLimit, Math.max(1, quantity));

      if (safeQuantity < 1) {
        return state;
      }

      const existingItem = state.items.find((item) => item.id === productId);

      if (existingItem) {
        return buildState(
          state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.min(getStockLimit(item), item.quantity + safeQuantity) }
              : item,
          ),
        );
      }

      return buildState([...state.items, { ...product, quantity: safeQuantity }]);
    }

    case INCREMENT_CART_ITEM:
      return buildState(
        state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.min(getStockLimit(item), item.quantity + 1) }
            : item,
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

    case CLEAR_CART:
      return buildState([]);

    default:
      return state;
  }
};

export default cartReducer;
