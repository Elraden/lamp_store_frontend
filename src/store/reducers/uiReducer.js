import {
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
  SET_ACTIVE_CATEGORY,
  SET_ACTIVE_IMAGE,
  SET_SEARCH_QUERY,
} from "../actionTypes";
import { ALL_PRODUCTS_CATEGORY } from "../../constants/catalog";

const initialState = {
  searchQuery: "",
  activeImageIndex: 0,
  activeCategory: ALL_PRODUCTS_CATEGORY,
  quantities: {},
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case SET_ACTIVE_IMAGE:
      return {
        ...state,
        activeImageIndex: action.payload,
      };

    case SET_ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload,
      };

    case INCREMENT_QUANTITY: {
      const productId = action.payload;

      return {
        ...state,
        quantities: {
          ...state.quantities,
          [productId]: (state.quantities[productId] ?? 1) + 1,
        },
      };
    }

    case DECREMENT_QUANTITY: {
      const productId = action.payload;
      const currentValue = state.quantities[productId] ?? 1;

      return {
        ...state,
        quantities: {
          ...state.quantities,
          [productId]: Math.max(1, currentValue - 1),
        },
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
