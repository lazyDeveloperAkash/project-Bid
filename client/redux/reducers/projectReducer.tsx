import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Project {
  id: string
  title: string
  description: string
  budgetMin: number
  budgetMax: number
  deadline: string
  status: "PENDING" | "IN_PROGRESS" | "CONFIRM" | "COMPLETED" | "CANCELLED"
  buyerId: string
  sellerId?: string
  bids?: Bid[]
  deliverables?: string[]
  createdAt: string
  updatedAt: string
  _count?: {
    bids: number
    deliverables: number
  }
}

export interface Bid {
  id: string
  sellerId: string
  name: string
  amount: number
  estimatedTime: string
  message: string
  createdAt: string;
  seller?:{
    name: string
  } 
}

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
}

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload)
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index: number = state.projects.findIndex((p: Project) => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  setProjects,
  addProject,
  updateProject,
  setCurrentProject,
  clearCurrentProject,
  setLoading,
} = projectSlice.actions

export default projectSlice.reducer
