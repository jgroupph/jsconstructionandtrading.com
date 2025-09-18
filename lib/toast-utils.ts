import { toast } from "@/hooks/use-toast"

export const showSuccessToast = (message: string, title: string = "Success") => {
  toast({
    title,
    description: message,
  })
}

export const showErrorToast = (message: string, title: string = "Error") => {
  toast({
    title,
    description: message,
    variant: "destructive",
  })
}

export const showLoadingToast = (message: string, title: string = "Loading") => {
  toast({
    title,
    description: message,
  })
}

// Specific toast messages for common operations
export const toastMessages = {
  // Project messages
  projectAddedSuccess: "Project added successfully",
  projectUpdatedSuccess: "Project updated successfully", 
  projectDeletedSuccess: "Project deleted successfully",
  projectAddFailed: "Failed to add project",
  projectUpdateFailed: "Failed to update project",
  projectDeleteFailed: "Failed to delete project",
  
  // Brand messages  
  brandAddedSuccess: "Brand added successfully",
  brandUpdatedSuccess: "Brand updated successfully",
  brandDeletedSuccess: "Brand deleted successfully",
  brandAddFailed: "Failed to add brand", 
  brandUpdateFailed: "Failed to update brand",
  brandDeleteFailed: "Failed to delete brand",
  
  // Equipment messages
  equipmentAddedSuccess: "Equipment added successfully",
  equipmentUpdatedSuccess: "Equipment updated successfully",
  equipmentDeletedSuccess: "Equipment deleted successfully", 
  equipmentAddFailed: "Failed to add equipment",
  equipmentUpdateFailed: "Failed to update equipment",
  equipmentDeleteFailed: "Failed to delete equipment",
  
  // Core values messages
  coreValueAddedSuccess: "Core value added successfully",
  coreValueUpdatedSuccess: "Core value updated successfully",
  coreValueDeletedSuccess: "Core value deleted successfully",
  coreValueAddFailed: "Failed to add core value",
  coreValueUpdateFailed: "Failed to update core value", 
  coreValueDeleteFailed: "Failed to delete core value",
  
  // Milestone messages
  milestoneAddedSuccess: "Milestone added successfully",
  milestoneUpdatedSuccess: "Milestone updated successfully",
  milestoneDeletedSuccess: "Milestone deleted successfully",
  milestoneAddFailed: "Failed to add milestone",
  milestoneUpdateFailed: "Failed to update milestone",
  milestoneDeleteFailed: "Failed to delete milestone",
  
  // Mission/Vision messages
  missionVisionUpdatedSuccess: "Mission & Vision updated successfully",
  missionVisionUpdateFailed: "Failed to update Mission & Vision",
  
  // File validation messages
  invalidFileType: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
  fileSizeExceeded: "File size too large. Maximum size is 5MB.",
  
  // Generic messages
  fetchFailed: "Failed to fetch data",
  uploadFailed: "Failed to upload file",
  networkError: "Network error occurred",
  unexpectedError: "An unexpected error occurred",
}
