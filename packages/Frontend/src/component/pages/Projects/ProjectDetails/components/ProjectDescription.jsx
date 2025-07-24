const ProjectDescription = ({ description }) => {
  return (
    <div className="ml-16 pt-4">
      <h1 className="font-medium text-4xl dark:text-[#e2e2e2]">Description</h1>
      <p className="text-gray-800 leading-8 text-xl my-4 dark:text-[#a0a0a0]">
        {description}
      </p>
    </div>
  );
};

export default ProjectDescription; 