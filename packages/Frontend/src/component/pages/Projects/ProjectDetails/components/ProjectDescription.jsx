const ProjectDescription = ({ description }) => {
  return (
    <div className="px-4 lg:px-0 lg:ml-16 pt-4">
      <h1 className="font-medium text-2xl sm:text-3xl lg:text-4xl dark:text-[#e2e2e2]">
        Description
      </h1>
      <p className="text-gray-800 leading-6 sm:leading-7 lg:leading-8 text-base sm:text-lg lg:text-xl my-4 dark:text-[#a0a0a0] break-words">
        {description}
      </p>
    </div>
  );
};

export default ProjectDescription;
