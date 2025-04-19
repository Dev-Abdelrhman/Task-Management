import React from "react";

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Calendar, MoreHorizontal, Plus } from "lucide-react"

export default function AllTasks() {
  // Initial board data based on the design
  const [board, setBoard] = useState({
    columns: [
      {
        id: "backlog",
        title: "BACKLOG",
        count: 2,
        tasks: [
          {
            id: "task-1",
            title: "Implement Security Enhancements",
            dueDate: "Nov 06",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-2",
            title: "Organize Team Building Event",
            dueDate: "Nov 11",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
        ],
      },
      {
        id: "todo",
        title: "TODO",
        count: 3,
        tasks: [
          {
            id: "task-3",
            title: "Create Marketing Campaign",
            dueDate: "Nov 12",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-4",
            title: "Design New Logo Concepts",
            dueDate: "Nov 13",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-5",
            title: "Perform Data Analysis",
            dueDate: "Nov 14",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
        ],
      },
      {
        id: "in-progress",
        title: "IN PROGRESS",
        count: 4,
        tasks: [
          {
            id: "task-6",
            title: "Optimize Website Performance",
            dueDate: "Nov 19",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-7",
            title: "Develop Mobile App Prototype",
            dueDate: "Nov 10",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-8",
            title: "Coordinate Software Testing",
            dueDate: "Nov 10",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-9",
            title: "Organize Charity Fundraiser",
            dueDate: "Nov 15",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
        ],
      },
      // {
      //   id: "in-review",
      //   title: "IN REVIEW",
      //   count: 3,
      //   tasks: [
      //     {
      //       id: "task-10",
      //       title: "Coordinate Project Kickoff",
      //       dueDate: "Nov 06",
      //       assignee: {
      //         avatar: "/placeholder.svg?height=32&width=32",
      //       },
      //     },
      //     {
      //       id: "task-11",
      //       title: "Plan Product Launch Strategy",
      //       dueDate: "Nov 07",
      //       assignee: {
      //         avatar: "/placeholder.svg?height=32&width=32",
      //       },
      //     },
      //     {
      //       id: "task-12",
      //       title: "Lead Sales Training Workshop",
      //       dueDate: "Nov 09",
      //       assignee: {
      //         avatar: "/placeholder.svg?height=32&width=32",
      //       },
      //     },
      //     {
      //       id: "task-13",
      //       title: "Conduct Market Research",
      //       dueDate: "Nov 10",
      //       assignee: {
      //         avatar: "/placeholder.svg?height=32&width=32",
      //       },
      //     },
      //   ],
      // },
      {
        id: "done",
        title: "DONE",
        count: 3,
        tasks: [
          {
            id: "task-14",
            title: "Write Content for Blog Posts",
            dueDate: "Nov 08",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-15",
            title: "Facilitate Client Feedback Session",
            dueDate: "Nov 08",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
          {
            id: "task-16",
            title: "Review Financial Reports",
            dueDate: "Nov 10",
            assignee: {
              avatar: "/placeholder.svg?height=32&width=32",
            },
          },
        ],
      },
    ],
  })

  // Handle drag end event
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped back to its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Create a copy of the board data
    const newBoard = { ...board }

    // Find the source and destination columns
    const sourceColumn = newBoard.columns.find((col) => col.id === source.droppableId)
    const destColumn = newBoard.columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Get the task that was moved
    const task = sourceColumn.tasks[source.index]

    // Remove the task from the source column
    sourceColumn.tasks.splice(source.index, 1)

    // Add the task to the destination column
    destColumn.tasks.splice(destination.index, 0, task)

    // Update the counts
    sourceColumn.count = sourceColumn.tasks.length
    destColumn.count = destColumn.tasks.length

    // Update the board state
    setBoard(newBoard)
  }

  // Function to add a new task to a column
  const addTask = (columnId) => {
    const newBoard = { ...board }
    const column = newBoard.columns.find((col) => col.id === columnId)

    if (!column) return

    const newTask = {
      id: `task-${Date.now()}`,
      title: "New Task",
      dueDate: "Nov 20",
      assignee: {
        avatar: "/placeholder.svg?height=32&width=32",
      },
    }

    column.tasks.push(newTask)
    column.count = column.tasks.length

    setBoard(newBoard)
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen rounded-[30px]">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-72">
              <div className="rounded-[30px]">
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{column.title}</span>
                    {/* <span className=" bg-[#0c86ff]  text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {column.count}
                    </span> */}
                    <span
                      className={`text-white rounded-full w-6 h-6 flex items-center justify-center text-xs
                        /*
                        BACKLOG
                        TODO
                        IN PROGRESS
                        IN REVIEW
                        DONE
                        */ 
                        ${column.id === "todo"
                          ? "bg-[#65aaee]"
                          : column.id === "in-progress"
                            ? "bg-[#e5e747]"
                            : column.id === "done"
                              ? "bg-red-500"
                              : "bg-[#66d475]"
                        }`}
                    >
                      {column.count}
                    </span>
                  </div>
                  <div className="btn-container bg-white rounded-[50%] border border-[#808080]">
                    <button
                      onClick={() => addTask(column.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="p-2 min-h-[200px]">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white border border-gray-200 rounded-[12px] p-3 mb-2 shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                                <h3 className="text-sm font-medium">{task.title}</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal size={16} />
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar size={14} />
                                  <span>{task.dueDate}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}