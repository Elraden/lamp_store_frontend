import { combineReducers, compose, createStore } from "redux";
import catalogReducer from "../store/reducers/catalogReducer";
import uiReducer from "../store/reducers/uiReducer";
import cartReducer from "../store/reducers/cartReducer";
import favoritesReducer from "../store/reducers/favoritesReducer";

const rootReducer = combineReducers({
  catalog: catalogReducer,
  ui: uiReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
});

const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(rootReducer, composeEnhancers());

export default store;
