import Modal from "@/components/Modal";
import {
  Priority,
  Status,
  useCreateTaskMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import React, { useState, useEffect } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetAuthUserQuery({});

  console.log("Current user data:", currentUser);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  // Set author user ID to current user when available
  useEffect(() => {
    if (currentUser?.userDetails?.userId) {
      console.log(
        "Setting author user ID to:",
        currentUser.userDetails.userId.toString(),
      );
      setAuthorUserId(currentUser.userDetails.userId.toString());
    }
  }, [currentUser]);

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Initialize with defaults when opening
      setTitle("");
      setDescription("");
      setStatus(Status.ToDo);
      setPriority(Priority.Backlog);
      setTags("");
      setStartDate("");
      setDueDate("");
      setAssignedUserId("");

      // Only reset projectId if we don't have an id prop
      if (id === null) {
        setProjectId("");
      }

      // Make sure author ID is set from currentUser
      if (currentUser?.userDetails?.userId) {
        setAuthorUserId(currentUser.userDetails.userId.toString());
      }
    } else {
      // Reset everything when closing
      setTitle("");
      setDescription("");
      setStatus(Status.ToDo);
      setPriority(Priority.Backlog);
      setTags("");
      setStartDate("");
      setDueDate("");
      setAssignedUserId("");
      setProjectId("");
    }
  }, [isOpen, currentUser, id]);
  const handleSubmit = async () => {
    // Check if the form is valid
    if (!isFormValid()) {
      console.log("Form validation failed on submit");
      return;
    }

    try {
      // Only format dates if they have been provided
      const formattedStartDate =
        startDate && startDate.trim() !== ""
          ? formatISO(new Date(startDate))
          : undefined;

      const formattedDueDate =
        dueDate && dueDate.trim() !== ""
          ? formatISO(new Date(dueDate))
          : undefined;

      // Safely handle the projectId - use id prop if available, otherwise use the input field
      let finalProjectId;
      try {
        finalProjectId =
          id !== null ? parseInt(id as string) : parseInt(projectId);

        if (isNaN(finalProjectId)) {
          throw new Error("Invalid Project ID");
        }
      } catch (err) {
        console.error("Error parsing project ID:", err);
        alert("Invalid Project ID. Please enter a valid number.");
        return;
      }

      // Safely parse author ID
      let finalAuthorUserId;
      try {
        // If we have a current user ID, use that; otherwise use the manually entered one
        const authorIdToUse =
          authorUserId || currentUser?.userDetails?.userId?.toString() || "";

        if (!authorIdToUse) {
          throw new Error("No Author User ID available");
        }

        finalAuthorUserId = parseInt(authorIdToUse);
        if (isNaN(finalAuthorUserId)) {
          throw new Error("Invalid Author User ID");
        }
      } catch (err) {
        console.error("Error parsing author user ID:", err);
        alert("Invalid or missing Author User ID. Please try again.");
        return;
      }

      // Safely parse assigned user ID if provided
      let finalAssignedUserId = undefined;
      if (assignedUserId.trim() !== "") {
        try {
          finalAssignedUserId = parseInt(assignedUserId);
          if (isNaN(finalAssignedUserId)) {
            throw new Error("Invalid Assigned User ID");
          }
        } catch (err) {
          console.error("Error parsing assigned user ID:", err);
          alert(
            "Invalid Assigned User ID. Please enter a valid number or leave empty.",
          );
          return;
        }
      }

      await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: finalAuthorUserId,
        assignedUserId: finalAssignedUserId,
        projectId: finalProjectId,
      });

      // Close modal and reset form on success
      onClose();
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };
  const isFormValid = () => {
    // The check should determine if we have a project ID from either the id prop or the projectId state
    const hasValidTitle = title.trim() !== "";

    // For author ID, we need to handle the case where it might still be loading
    const hasValidAuthor = authorUserId.trim() !== "";

    // Check if either we have an id prop or the user entered a projectId
    const hasValidProjectId = id !== null || projectId.trim() !== "";

    const valid = hasValidTitle && hasValidAuthor && hasValidProjectId;

    console.log("Form validation:", {
      title,
      authorUserId,
      isUserLoading,
      userError,
      id,
      projectId,
      hasValidTitle,
      hasValidAuthor,
      hasValidProjectId,
      valid,
    });

    return valid;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* User ID status indicator for debugging */}
        <div className="mb-2 rounded bg-gray-100 p-2 text-xs dark:bg-dark-secondary">
          <p>
            User ID Status:{" "}
            {isUserLoading
              ? "Loading..."
              : userError
                ? "Error"
                : currentUser?.userDetails?.userId
                  ? "Loaded"
                  : "Not Found"}
          </p>
          {userError && (
            <p className="text-red-500">
              Error: {
                'message' in userError 
                  ? userError.message 
                  : 'status' in userError 
                    ? `${userError.status}: ${JSON.stringify(userError.data)}` 
                    : "Unknown error"
              }
            </p>
          )}
          {currentUser?.userDetails?.userId && (
            <p>User ID: {currentUser.userDetails.userId}</p>
          )}
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) =>
              setStatus(Status[e.target.value as keyof typeof Status])
            }
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>{" "}
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Start Date</label>
            <input
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Due Date</label>
            <input
              type="date"
              className={inputStyles}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>{" "}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Author User ID {isUserLoading ? "(loading...)" : ""}
          </label>
          <input
            type="number"
            className={inputStyles}
            placeholder="Author User ID (auto-filled or enter manually)"
            value={authorUserId}
            onChange={(e) => {
              // Allow manual entry of author ID
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setAuthorUserId(value);
              }
            }}
            min="1"
            required
          />
          {userError && (
            <p className="mt-1 text-sm text-red-500">
              Error loading user: {
                'message' in userError 
                  ? userError.message 
                  : 'status' in userError 
                    ? `${userError.status}: ${JSON.stringify(userError.data)}` 
                    : "Unknown error"
              }. Please enter your user ID manually.
            </p>
          )}
        </div>{" "}
        <input
          type="number"
          className={inputStyles}
          placeholder="Assigned User ID (optional)"
          value={assignedUserId}
          onChange={(e) => {
            // Ensure only valid numbers are entered
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              setAssignedUserId(value);
            }
          }}
          min="1"
        />
        {id === null && (
          <input
            type="number"
            className={inputStyles}
            placeholder="ProjectId (required)"
            value={projectId}
            onChange={(e) => {
              // Ensure only valid numbers are entered
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setProjectId(value);
              }
            }}
            min="1"
            required
          />
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
