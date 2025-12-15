  import { createSlice } from '@reduxjs/toolkit';

  const initialState = {
    token: null,
    firstname: null,
    lastname: null,
    mail: null,
  };

  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      login: (state, action) => {
        state.token = action.payload.token;
        state.firstname = action.payload.firstname;
        state.lastname = action.payload.lastname;
        state.mail = action.payload.mail;
      },
      logout: (state) => {
        state.token = null;
        state.firstname = null;
        state.lastname = null;
        state.mail = null;
      },
    },
  });

  export const { login, logout } = userSlice.actions;
  export default userSlice.reducer;
