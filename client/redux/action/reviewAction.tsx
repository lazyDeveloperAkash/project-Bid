import axios from "@/lib/axios-config";
import { toast } from "sonner";
import { asFetchProjectById } from "./projectAction";
import { setLoading } from "../reducers/userReducer";

export const asUploadReview = (projectId: string, reviewData: {score: number, comment: string}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.post(`/review/create/${projectId}`, reviewData);
    if(data)
    toast.success(data?.message || "Review Posted");
    dispatch(asFetchProjectById(projectId));
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to post review");
    console.log(error);
  } finally{
    dispatch(setLoading(false))
  }
};