import axios from "@/lib/axios-config";
import {
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  setLoading,
  clearCurrentProject,
} from "../reducers/projectReducer";
import { toast } from "sonner";

export const asFetchProjects = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.get("/project");
    dispatch(setProjects(data.data));
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to fetch projects");
  } finally {
    dispatch(setLoading(false));
  }
};

export const asFetchBuyerProjects = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.get("/project/my-projects");
    dispatch(setProjects(data.data));
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Failed to fetch buyer projects"
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const asFetchSellerBids = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.get("/bid/my-bids");
    return data.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to fetch seller bids");
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const asCreateProject = (projectData: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.post("/project", projectData);
    dispatch(addProject(data));
    dispatch(setCurrentProject(data));
    return true;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to create project");
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const asFetchProjectById =
  (projectId: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.get(`/project/${projectId}`);
      dispatch(setCurrentProject(data.data));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch project");
    } finally {
      dispatch(setLoading(false));
    }
  };

export const asCreateBid =
  (projectId: string, bidData: any) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.post(`/bid/projects/${projectId}`, bidData);
      await dispatch(asFetchProjectById(projectId));
      toast.success(data?.message || "Bid Created");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create bid");
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const asSelectSeller =
  (projectId: string, bidId: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.post(
        `/project/${projectId}/select-seller`,
        { bidId }
      );
      toast.success("Seller Selected");
      dispatch(setCurrentProject(data.data));
      dispatch(updateProject(data.data));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to select seller");
    } finally {
      dispatch(setLoading(false));
    }
  };

export const asUpdateProjectStatus =
  (projectId: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.patch(`/project/${projectId}/confirm-completion`);
      toast.success(data?.data?.message || "Project Aproved");
      dispatch(setCurrentProject(data.data));
      dispatch(updateProject(data.data));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  export const asUpdateProjectStatusBySeller =
  (projectId: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.patch(`/project/${projectId}/complete`);
      toast.success(data?.message || "Project Submited");
      dispatch(setCurrentProject(data.data));
      dispatch(updateProject(data.data));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const asUploadDeliverables =
  (projectId: string, formData: FormData) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.post(
        `/project/${projectId}/deliverables`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data?.message || "File Uploaded")
      dispatch(setCurrentProject(data.data));
      dispatch(updateProject(data.data));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to upload deliverables"
      );
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
