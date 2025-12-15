// src/store/auth/authActions.ts
import axios from "@/lib/axios-config";
import { addUser, removeUser, setLoading, setFetchUserLoading } from "../reducers/userReducer";
import { toast } from "sonner";

export const authSignIn =
  (credentials: { email: string; password: string }) =>
  async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.post("/user/login", credentials);

      await dispatch(addUser({ user: data.user, isLogin: true }));

      return data?.user;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign in");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const authSignUp =
  (userData: {
    name: string;
    email: string;
    password: string;
    userType: string;
  }) =>
  async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.post("/user/register", userData);

      await dispatch(addUser(data.user));
      toast.success("Account created");

      return data?.user;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign up");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const authFetchCurrent =
  (): ((dispatch: any) => Promise<boolean>) => async (dispatch: any) => {
    try {
      dispatch(setFetchUserLoading(true));
      const { data } = await axios.get("/user/profile");

      await dispatch(addUser(data.data));
      return true;
    } catch (error: any) {
      dispatch(removeUser());
      // toast.error(error.response?.data?.message || "Session expired");
      return false;
    } finally {
      dispatch(setFetchUserLoading(false));
    }
  };

export const authLogout = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(false));
    await axios.post("/user/logout");
    dispatch(removeUser());
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error("Logout failed");
  } finally {
    dispatch(setLoading(false));
  }
};
