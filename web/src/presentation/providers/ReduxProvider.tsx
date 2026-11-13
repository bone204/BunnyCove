"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../../infrastructure/rtk/store";
import { initializeAuth } from "../../infrastructure/rtk/slices/authSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

