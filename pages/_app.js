// import Head from 'next/head';
// import Header from '../components/global/Header';
// import '../styles/globals.css';

// redux
// import {combineReducers, configureStore} from '@reduxjs/toolkit';
// import {Provider} from 'react-redux';
// import user from '../reducer/user';

// redux-persist
// import {persistReducer, persistStore} from 'redux-persist';
// import {PersistGate} from 'redux-persist/integration/react';
// import storage from 'redux-persist/lib/storage';

// const reducers = combineReducers({user});
// const persistConfig = {key: 'applicationName', storage};

// const store = configureStore({
// 	reducer: persistReducer(persistConfig, reducers),
// 	middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
// });

// function App({Component, pageProps}) {
// 	return (
// 		<>
// 			<Provider store={store}>
// 				<PersistGate persistor={persistor}> 
// 			<Head>
// 				<title>MVP</title>
// 			</Head>
// 			<Header />
// 			<Component {...pageProps} />
// 			 </PersistGate>
// 			</Provider> 
// 		</>
// 	);
// }

// export default App;
import Head from "next/head";
import Header from "../components/global/Header";
import "../styles/globals.css";

// --- Redux ---
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import user from "../reducer/user";

// --- Redux Persist ---
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const reducers = combineReducers({ user });

const persistConfig = {
  key: "applicationName",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>MVP</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
