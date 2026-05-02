import { TOGGLE_FAVORITE } from "../actionTypes";

const initialState = {
  ids: [],
};

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      const productId = action.payload;
      const hasFavorite = state.ids.includes(productId);

      return {
        ...state,
        ids: hasFavorite
          ? state.ids.filter((id) => id !== productId)
          : [...state.ids, productId],
      };
    }

    default:
      return state;
  }
};

export default favoritesReducer;
