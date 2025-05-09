// Ambil keranjang awal dari localStorage
const getInitialCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    const cart = stored ? JSON.parse(stored) : [];
    return Array.isArray(cart) ? cart : [];
  } catch (err) {
    console.error("Error parsing cart:", err);
    return [];
  }
};

// Reducer cart
const handleCart = (state = getInitialCart(), action) => {
  const { payload, type } = action;
  let updatedCart;

  switch (type) {
    case "ADDITEM":
      const addLevel = payload.level || payload.level_id || "default";

      const existing = state.find(
        (item) => item.id === payload.id && item.level === addLevel
      );

      updatedCart = existing
        ? state.map((item) =>
            item.id === payload.id && item.level === addLevel
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        : [
            ...state,
            {
              ...payload,
              qty: 1,
              level: addLevel,
            },
          ];
      break;

    case "DECREASEITEM":
      const decreaseLevel = payload.level || payload.level_id || "default";

      updatedCart = state
        .map((item) =>
          item.id === payload.id && item.level === decreaseLevel
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0);
      break;

    case "DELITEM":
      const delLevel = payload.level || payload.level_id || "default";

      updatedCart = state.filter(
        (item) => !(item.id === payload.id && item.level === delLevel)
      );
      break;

    case "CLEAR_CART":
      updatedCart = [];
      break;

    default:
      return state;
  }

  // Simpan cart ke localStorage
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return updatedCart;
};

export default handleCart;
