import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import catalogReducer from "../store/reducers/catalogReducer";
import uiReducer from "../store/reducers/uiReducer";
import cartReducer from "../store/reducers/cartReducer";
import favoritesReducer from "../store/reducers/favoritesReducer";
import ordersReducer from "../store/reducers/ordersReducer";

const rootReducer = combineReducers({
  catalog: catalogReducer,
  ui: uiReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  orders: ordersReducer,
});

const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const thunkMiddleware = (storeApi) => (next) => (action) =>
  typeof action === "function" ? action(storeApi.dispatch, storeApi.getState) : next(action);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;
