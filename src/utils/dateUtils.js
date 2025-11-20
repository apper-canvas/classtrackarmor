import { format, isAfter, isBefore, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
};

export const formatDateShort = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy");
};

export const isDeadlinePassed = (dueDate) => {
  return isAfter(new Date(), new Date(dueDate));
};

export const getDeadlineStatus = (dueDate) => {
  const now = new Date();
  const deadline = new Date(dueDate);
  
  if (isAfter(now, deadline)) {
    return { status: "overdue", color: "red" };
  }
  
  const hoursLeft = differenceInHours(deadline, now);
  const daysLeft = differenceInDays(deadline, now);
  
  if (hoursLeft < 24) {
    return { status: "urgent", color: "red" };
  } else if (daysLeft < 7) {
    return { status: "warning", color: "amber" };
  } else {
    return { status: "normal", color: "emerald" };
  }
};

export const getTimeRemaining = (dueDate) => {
  const now = new Date();
  const deadline = new Date(dueDate);
  
  if (isAfter(now, deadline)) {
    return "Overdue";
  }
  
  const daysLeft = differenceInDays(deadline, now);
  const hoursLeft = differenceInHours(deadline, now);
  const minutesLeft = differenceInMinutes(deadline, now);
  
  if (daysLeft > 0) {
    return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  } else if (hoursLeft > 0) {
    return `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"} left`;
  } else if (minutesLeft > 0) {
    return `${minutesLeft} minute${minutesLeft === 1 ? "" : "s"} left`;
  } else {
    return "Due now";
  }
};