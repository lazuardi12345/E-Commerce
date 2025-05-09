import { configureStore } from '@reduxjs/toolkit';
import handleCart from './reducer/handleCart'; // pastikan path-nya sesuai

export const store = configureStore({
  reducer: {
    handleCart: handleCart,
  },
});

export default store;
