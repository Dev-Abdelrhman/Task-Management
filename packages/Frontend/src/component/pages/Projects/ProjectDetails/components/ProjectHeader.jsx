import { Box, Button } from "@mui/material";

const ProjectHeader = ({ project, onJoinClick }) => {
  return (
    <>
      <Box
        component="img"
        src={
          project?.image?.[0]?.url ||
          "https://placehold.co/612x612?text=No+Image&font=roboto"
        }
        alt="check your img project"
        sx={{
          width: "100%",
          height: { xs: 300, sm: 400, md: 500, lg: 550 },
          objectFit: "cover",
          borderRadius: { xs: 15, sm: 6, md: 6, lg: 5 },
          my: { xs: 2, sm: 3, md: 4 },
          mx: { xs: 0, sm: 0, md: 0, lg: 4 },
          px: { xs: 2, sm: 3, md: 4, lg: 0 },
        }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 lg:px-0 lg:ml-16 mt-4 gap-4">
        <h1 className="font-medium text-2xl sm:text-3xl lg:text-4xl dark:text-[#e2e2e2] break-words">
          {project?.name}
        </h1>
        <Button
          onClick={onJoinClick}
          className="!text-sm sm:!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !h-10 sm:!h-12 lg:!h-14 !w-full sm:!w-[200px] lg:!w-48 !rounded-xl"
        >
          Join Tasks
        </Button>
      </div>
    </>
  );
};

export default ProjectHeader;
