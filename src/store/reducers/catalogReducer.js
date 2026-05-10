import { catalogData } from "../../mocks/catalog";
import {
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
} from "../actionTypes";

const placeholderImage = catalogData.catalogProducts[0]?.image ?? "";

const availabilityLabels = {
  available: "В наличии",
  in_stock: "В наличии",
  IN_STOCK: "В наличии",
  out_of_stock: "Нет в наличии",
  OUT_OF_STOCK: "Нет в наличии",
  preorder: "Под заказ",
  PREORDER: "Под заказ",
  discontinued: "Снят с продажи",
  DISCONTINUED: "Снят с продажи",
};

const normalizeAvailability = (status, stock) => {
  if (stock <= 0) {
    return "Нет в наличии";
  }

  return availabilityLabels[status] ?? "В наличии";
};

const findAttributeValue = (attributes, search) =>
  attributes.find((attribute) => attribute.name.toLowerCase().includes(search))?.value ?? "";

const normalizeProduct = (product) => {
  const mainImage = product.images?.find((image) => image.is_main) ?? product.images?.[0];
  const images = product.images?.map((image) => image.image_url).filter(Boolean) ?? [];
  const attributes = product.attributes ?? [];
  const specifications = attributes.map((attribute) => ({
    label: attribute.name,
    value: attribute.value,
  }));

  return {
    id: String(product.product_id),
    category: product.category?.name ?? "Каталог",
    title: product.name,
    article: product.sku,
    brand: product.brand?.name ?? "Без бренда",
    price: Number(product.price),
    base: findAttributeValue(attributes, "цок"),
    wattage: findAttributeValue(attributes, "мощ"),
    temperature: findAttributeValue(attributes, "темпера"),
    stock: product.stock_qty,
    rating: Number(product.rating),
    image: mainImage?.image_url ?? images[0] ?? placeholderImage,
    images: images.length > 0 ? images : [placeholderImage],
    availability: normalizeAvailability(product.availability_status, product.stock_qty),
    description: product.description,
    paymentNote: "Оплата курьеру при получении",
    specifications:
      specifications.length > 0
        ? specifications
        : [
            { label: "Бренд", value: product.brand?.name ?? "Без бренда" },
            { label: "Артикул", value: product.sku },
            { label: "Остаток", value: `${product.stock_qty} шт.` },
          ],
  };
};

const buildCatalogState = (products, overrides = {}) => {
  const categories = [
    catalogData.categories[0],
    ...Array.from(new Set(products.map((product) => product.category))).filter(Boolean),
  ];
  const brands = Array.from(new Set(products.map((product) => product.brand))).filter(Boolean);

  return {
    ...catalogData,
    ...overrides,
    product: products[0] ?? catalogData.product,
    catalogProducts: products,
    similarProducts: products.slice(0, 6),
    checkoutItems: [],
    categories,
    brands: brands.length > 0 ? brands : catalogData.brands,
  };
};

const initialState = buildCatalogState(catalogData.catalogProducts, {
  isLoading: false,
  error: null,
});

const catalogReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_PRODUCTS_SUCCESS:
      return buildCatalogState(action.payload.map(normalizeProduct), {
        isLoading: false,
        error: null,
      });

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default catalogReducer;
