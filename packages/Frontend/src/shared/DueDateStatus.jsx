import React from "react";
import { DateTime } from "luxon";
import { Clock, CircleCheck, Ban } from "lucide-react";

const DueDateStatus = ({ dueDate, progress }) => {
  if (progress === 100) {
    return (
      <>
        <CircleCheck className="w-5 h-5 text-green-500" />
        <span className="text-green-500">Completed</span>
      </>
    );
  }

  if (!dueDate) return <span>No due date</span>;

  const now = DateTime.local();
  const due = DateTime.fromISO(dueDate);

  if (due < now) {
    return (
      <>
        <Ban className="w-5 h-5 text-red-500" />
        <span className="text-red-500">Overdue</span>
      </>
    );
  }

  const diff = due.diff(now, ["days", "hours"]);

  if (diff.days < 1) {
    return (
      <>
        <Clock className="w-5 h-5 text-gray-500" />
        <span>{Math.ceil(diff.hours)} Hours Left</span>
      </>
    );
  }

  return (
    <>
      <Clock className="w-5 h-5 text-gray-500" />
      <span>{Math.ceil(diff.days)} Days Left</span>
    </>
  );
};

export default DueDateStatus; 