// Tambah item ke cart, dengan level default jika tidak ada
export const addCart = (product, level = "default") => {
    return {
      type: "ADDITEM",
      payload: {
        ...product,
        level,
      },
    };
  };
  
  // Hapus seluruh item dari cart (berdasarkan id & level)
  export const delCart = (product) => {
    return {
      type: "DELITEM",
      payload: product,
    };
  };
  
  // Kurangi jumlah qty item
  export const decreaseCart = (product) => {
    return {
      type: "DECREASEITEM",
      payload: product,
    };
  };
  
  // Kosongkan seluruh cart
  export const clearCart = () => {
    return {
      type: "CLEAR_CART",
    };
  };
  