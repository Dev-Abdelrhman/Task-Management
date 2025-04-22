import { Box, CircularProgress , Button, Chip } from "@mui/material"
import { Calendar, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getProjectById } from "../../../api/project"
import { useState } from "react";

function ProjectDetails(){
    const {projectId} = useParams()
    const {data,isLoading,isError,error}= useQuery({
        queryKey: ["project",projectId],
        queryFn: async () => {
            return await getProjectById(projectId)
        }
    })
    const [tasks, setTasks] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [newTask,setNewTask] = useState("")
    const handleAddTask = () =>{
        if (newTask.trim()){
            setTasks([...tasks, newTask])
            setNewTask("")
            setOpenModal(false)
        }
    }
    const project = data?.doc 
    if (isLoading) {
        return(
            <div className="flex fixed top-0 left-0 w-full h-full justify-center">
                <CircularProgress/>

            </div>
        )
    }
    if (isError) {
        return (
            <div className="text-center text-red-500">
                Error: {error.message}
            </div>
        )
    }
    
    return(
        <>
        <div className="flex min-h-screen bg-[#FAFAFA]">
            <div className="h-full w-[68%]">
                <Box
                  component="img" src={"https://thealbexgroup.com/wp-content/uploads/2020/07/app-builder-smaller.png"} alt="check your img project"
                   sx={{
                    width: "100%",
                    height:550,
                    objectFit:"cover",
                    borderRadius:5,
                    my:4,
                    ml:4,
                   
                   }}
                />
                <div>
                    <div className="flex justify-between ml-16 ">
                        <h1 className="font-medium text-4xl">{project?.name}</h1>
                        <Button
                          className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !h-14 !w-48 !rounded-xl">
                          Join Tasks
                        </Button>
                   </div>
                   <div className="flex flex-wrap gap-2 mb-4 ml-20">
                      <p className="text-gray-800 ">{project?.description}</p>
                      
                      <p className=" text-[#546FFF] ">+ Add Members</p> 
                   </div>
                   <div className="flex flex-wrap gap-2 mb-4 ml-20 text-black">
                      <Users className="w-5 h-5 " />
                      <p variant="body2" className="mr-5">
                        200 Members Involved
                     </p>
                     <Clock className="w-4 h-5 " />
                     <p variant="body2">
                      1 Hour
                     </p>
                   </div>
                   <div className=" ml-16 pt-4 ">
                        <h1 className="font-medium text-4xl">Description</h1>
                        <p className="text-gray-800 leading-8 text-xl my-4"> Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn how to make a good and correct design. Starting from spacing, typography, content, and many other design hierarchies. Then try to make it yourself with your imagination and inspiration.</p>
                   </div>
                   <div className="flex justify-between ml-16 mt-4 ">
                        <h1 className="font-medium text-4xl">Essence of Assessment</h1>
                        <Button onClick={() => setOpenModal(true)}
                          className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !h-14 !w-48 !rounded-xl">
                          Add Task +
                        </Button>
                   </div>
                   <div className="ml-16">
                    {
                        tasks.map((task, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input type="checkbox" className="mr-4"/>
                                <p className="text-gray-800 leading-8 text-2xl ">{task}</p>
                             </div>    
                        ))
                    }
                   </div>
                </div>
               
            </div>
            {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white !rounded-xl p-6 w-[400px]">
                    <h2 className="text-2xl text-center font-medium mb-4">Add New Task</h2>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Enter task description"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <div className="flex  justify-between gap-2">
                        <Button
                            onClick={() => setOpenModal(false)}
                            className="!text-base !capitalize !bg-gray-300 !text-black !h-10 !w-24 !rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTask}
                            className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !text-white !h-10 !w-24 !rounded-xl">
                            Add
                        </Button>
                    </div>
                </div>
            </div>
        )}

            
            
      <div className="hidden 2xl:flex fixed right-0 top-0 h-full w-[420px] border-l border-gray-200 bg-[#F5F5F7] p-5 flex-col gap-4 overflow-y-auto">
        <div className="bg-white w-[370px] rounded-xl mt-[70px]  p-5 flex-col gap-4 overflow-y-auto">
            <p className="text-gray-800 leading-8 text-xl font-medium mb-2">Assigned Assignments</p>
            <div>
              <h4 className="font-bold text-2xl mb-4">{project?.name}</h4>
              <p className="text-gray-700 ">{project?.description}</p>
            </div>

          <h2 className="text-2xl font-medium my-4">Detail Student</h2>
          
          <div className="flex justify-between mb-4">
            <p className="text-gray-700">Student's name</p>
            <p className="text-sm font-medium text-black">Styler Diaz</p>
          </div>

        
          <div className="flex justify-between mb-4">
            <p className="text-gray-700">Student Class</p>
            <p className="text-sm font-medium text-black">MPB-2</p>
          </div>

          
          <div className="flex justify-between mb-4">
            <p className="text-gray-700">Student Number</p>
            <p className="text-sm font-medium text-blac;">10</p>
          </div>

        
          <div className="mb-4">
            <p className="text-2xl font-medium my-4">File task</p>
            <div className="flex justify-between mb-4">
              <p className="text-gray-700">Last Modified</p>
            <div className="flex gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-medium">1 JULY 2024 </p>
            </div>
          </div>
 
          <p className="text-gray-700 mb-4">File submissions</p>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
              <label className="block mt-2 h-36">
                <input
                  type="file"
                  multiple
                  className="hidden "
                />
                <span className="text-[#546FFF] cursor-pointer hover:underline pt-8">
                  + File Drop
                </span>
              </label>
            </div>
          </div>
          <Button
            className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !h-12 !w-full !rounded-xl"
          >
            Submit
          </Button>
        </div>

    
       

            </div>
        </div>
        </>
    )
}
export default ProjectDetails