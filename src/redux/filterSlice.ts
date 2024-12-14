import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutAsync } from './authSlice'; // Импорт logoutAsync из authSlice

interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
}

const loadFiltersFromLocalStorage = () => {
  const savedFilters = localStorage.getItem('filters');
  return savedFilters ? JSON.parse(savedFilters) : { category: '', minPrice: 1, maxPrice: 100000000 };
};

const saveFiltersToLocalStorage = (filters: { category: string; minPrice: number; maxPrice: number }) => {
  localStorage.setItem('filters', JSON.stringify(filters));
};

const initialState: FilterState = loadFiltersFromLocalStorage(); // Загрузка фильтров из localStorage

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      saveFiltersToLocalStorage(state); // Сохранение в localStorage
    },
    setMinPrice(state, action: PayloadAction<number>) {
      state.minPrice = action.payload;
      saveFiltersToLocalStorage(state);
    },
    setMaxPrice(state, action: PayloadAction<number>) {
      state.maxPrice = action.payload;
      saveFiltersToLocalStorage(state);
    },
    resetFilters(state) {
      state.category = '';
      state.minPrice = 1;
      state.maxPrice = 100000000;
      saveFiltersToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.category = '';
      state.minPrice = 1;
      state.maxPrice = 100000000;
      saveFiltersToLocalStorage(state); // Сохранение сброшенного состояния в localStorage
    });
  },
});

export const { setCategory, setMinPrice, setMaxPrice, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
