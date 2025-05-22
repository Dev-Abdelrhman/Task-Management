import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProjectHeader = ({ project, onJoinClick }) => {
  return (
    <>
      <Box
        component="img"
        src={project?.image?.[0]?.url || "https://fakeimg.pl/1280x720?text=No+Image"}
        alt="check your img project"
        sx={{
          width: "100%",
          height: 550,
          objectFit: "cover",
          borderRadius: 5,
          my: 4,
          ml: 4,
        }}
      />
      <div className="flex justify-between ml-16">
        <h1 className="font-medium text-4xl dark:text-[#e2e2e2]">
          {project?.name}
        </h1>
        <Button
          onClick={onJoinClick}
          className="!text-base !ml-2 !min-w-[150px] !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !h-14 !w-48 !rounded-xl"
        >
          Join Tasks
        </Button>
      </div>
    </>
  );
};

export default ProjectHeader; 