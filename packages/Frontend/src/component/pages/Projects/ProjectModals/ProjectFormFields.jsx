function ProjectFormFields({
  newProject,
  handleInputs,
  categories,
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  isEditMode,
  isLoading,
  isDeletingImage,
}) {
  return (
    <>
      {/* Name input */}
      <div>
        <label
          htmlFor="projectName"
          className="block mb-1 text-border dark:text-gray-400 font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-400 p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
          placeholder="Type project name"
          id="projectName"
          name="name"
          value={newProject.name}
          onChange={handleInputs}
          required={!isEditMode}
          disabled={isLoading || isDeletingImage}
        />
        <span className="block text-xs text-gray-500 mt-1">
          Characters left: {MAX_NAME_LENGTH - newProject.name.length}
        </span>
      </div>

      {/* Category Select Input */}
      <div>
        <label
          htmlFor="projectCategory"
          className="block dark:text-gray-400 mb-1 text-border font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="projectCategory"
          name="category"
          value={newProject.category}
          onChange={handleInputs}
          required={!isEditMode}
          disabled={isLoading || isDeletingImage}
          className="w-full dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500 p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
        >
          <option className="dark:text-gray-300" value="">
            Select a category
          </option>
          {categories.map((category) => (
            <option
              key={category}
              className="dark:text-gray-300"
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Description input */}
      <div>
        <label
          htmlFor="projectDescription"
          className="block dark:text-gray-400 mb-1 text-border font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          rows="3"
          className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-400 p-2 border !rounded-[5px] text-sm focus:outline-gray-400"
          placeholder="Write Project description"
          id="projectDescription"
          name="description"
          value={newProject.description}
          onChange={handleInputs}
          required={!isEditMode}
          disabled={isLoading || isDeletingImage}
        ></textarea>
        <span className="block text-xs text-gray-500 mt-1">
          Characters left:{" "}
          {MAX_DESCRIPTION_LENGTH - newProject.description.length}
        </span>
      </div>

      {/* Due date input */}
      <div>
        <label
          htmlFor="dueDate"
          className="block dark:text-gray-400 mb-1 text-border font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          type="date"
          className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-400 p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
          placeholder="Select due date"
          id="dueDate"
          name="dueDate"
          value={newProject.dueDate}
          onChange={handleInputs}
          required={!isEditMode}
          disabled={isLoading || isDeletingImage}
        />
      </div>
    </>
  );
}

export default ProjectFormFields; 