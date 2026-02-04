import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 取得購物車
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "取得購物車失敗",
    );
  }
});

// 加入購物車
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, qty = 1 }, thunkAPI) => {
    try {
      const data = {
        data: {
          product_id: productId,
          qty,
        },
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, data);

      thunkAPI.dispatch(getCart());
      return { productId, qty };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "加入購物車失敗",
      );
    }
  },
);

// 更新購物車數量
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartId, productId, qty = 1 }, thunkAPI) => {
    try {
      const data = {
        data: {
          product_id: productId,
          qty,
        },
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, data);

      thunkAPI.dispatch(getCart());
      return { cartId, productId, qty };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "更新購物車失敗",
      );
    }
  },
);

// 刪除購物車 item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ cartId }, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);

      thunkAPI.dispatch(getCart());
      return { cartId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "刪除購物車商品失敗",
      );
    }
  },
);

// 清空購物車
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);

      thunkAPI.dispatch(getCart());
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "清空購物車失敗",
      );
    }
  },
);

const initialState = {
  cartData: {
    carts: [],
    final_total: 0,
    total: 0,
  },
  status: "idle", // 載入購物車：idle | loading | succeeded | failed
  globalUpdating: false, // 清空購物車
  addingByProductId: {}, // 加入購物車：Products 用
  updatingByCartId: {}, // 更新、刪除購物車 iteml：Cart 單列更新用
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 載入購物車
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartData = action.payload;
      })
      .addCase(getCart.rejected, (state) => {
        state.status = "failed";
      })

      // 加入購物車
      .addCase(addToCart.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.addingByProductId[productId] = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { productId } = action.payload;
        delete state.addingByProductId[productId];
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.addingByProductId[productId];
      })

      // 更新購物車 item
      .addCase(updateCartItem.pending, (state, action) => {
        const { cartId } = action.meta.arg;
        state.updatingByCartId[cartId] = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cartId } = action.payload;
        delete state.updatingByCartId[cartId];
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        const { cartId } = action.meta.arg;
        delete state.updatingByCartId[cartId];
      })

      // 刪除購物車 item
      .addCase(deleteCartItem.pending, (state, action) => {
        const { cartId } = action.meta.arg;
        state.updatingByCartId[cartId] = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const { cartId } = action.payload;
        delete state.updatingByCartId[cartId];
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        const { cartId } = action.meta.arg;
        delete state.updatingByCartId[cartId];
      })

      // 清空購物車
      .addCase(clearCart.pending, (state) => {
        state.globalUpdating = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.globalUpdating = false;
      })
      .addCase(clearCart.rejected, (state) => {
        state.globalUpdating = false;
      });
  },
});

export default cartSlice.reducer;
