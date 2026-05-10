import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  UPDATE_CURRENT_ORDER,
} from "../actionTypes";

const initialState = {
  items: [],
  currentOrder: null,
  currentOrderItems: [],
  isSubmitting: false,
  error: null,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        items: [action.payload.order, ...state.items],
        currentOrder: action.payload.order,
        currentOrderItems: action.payload.cartItems,
        isSubmitting: false,
        error: null,
      };

    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
      };

    case UPDATE_CURRENT_ORDER:
      return {
        ...state,
        items: state.items.map((order) =>
          order.order_id === action.payload.order_id ? action.payload : order,
        ),
        currentOrder: action.payload,
      };

    default:
      return state;
  }
};

export default ordersReducer;
