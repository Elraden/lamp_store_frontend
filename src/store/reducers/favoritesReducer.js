import { TOGGLE_FAVORITE } from "../actionTypes";

const FAVORITES_STORAGE_KEY = "shop.favoriteProductIds";

const readFavoriteIds = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];

    return Array.isArray(parsedValue) ? parsedValue.map(String) : [];
  } catch {
    return [];
  }
};

const saveFavoriteIds = (ids) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
};

const initialState = {
  ids: readFavoriteIds(),
};

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      const productId = action.payload;
      const hasFavorite = state.ids.includes(productId);
      const ids = hasFavorite
        ? state.ids.filter((id) => id !== productId)
        : [...state.ids, productId];

      saveFavoriteIds(ids);

      return {
        ...state,
        ids,
      };
    }

    default:
      return state;
  }
};

export default favoritesReducer;
