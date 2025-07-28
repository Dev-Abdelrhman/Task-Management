const cloudinary = require("../utils/cloudinary.js");
const { get, set } = require("lodash");
const AppError = require("../utils/appError");
const { emitEvent } = require("../utils/eventLogger.js");

const createOneSocket =
  (Model, folderName = "", fieldName, idField, idField2) =>
  async ({ data }, callback, io) => {
    try {
      if (idField && !get(data, idField) && data.user) {
        set(data, idField, data.user.id);
      }
      if (idField2 && !get(data, idField2) && data.params) {
        set(data, idField2, data.params.id);
      }

      if (data.files && data.files.length > 0) {
        const uploadResults = await Promise.all(
          data.files.map((file) =>
            cloudinary.uploader.upload(file.path, {
              resource_type: "auto",
              folder: folderName,
            })
          )
        );
        data[fieldName] = uploadResults.map((result) => ({
          public_id: result.public_id,
          url: result.secure_url,
          original_filename: result.original_filename,
          format: result.format,
        }));
      }

      const doc = await Model.create(data);

      emitEvent(io, `${Model.modelName.toLowerCase()}-created`, doc);

      callback({ status: "success", message: "Created successfully", doc });
    } catch (err) {
      callback({
        status: "error",
        message:
          err instanceof AppError ? err.message : "Internal server error",
      });
    }
  };

const getAllSocket =
  (Model, filterField, popOptions = [], additionalFilter = {}) =>
  async ({ user, params }, callback) => {
    try {
      const filterValue = params?.id || user?.id;

      const filter = {
        ...(filterField ? { [filterField]: filterValue } : {}),
        ...additionalFilter,
      };

      let dbQuery = Model.find(filter);

      if (Array.isArray(popOptions) && popOptions.length > 0) {
        popOptions.forEach((pop) => {
          dbQuery = dbQuery.populate(pop);
        });
      }

      const docs = await dbQuery;

      callback({
        status: "success",
        results: docs.length,
        doc: docs,
      });
    } catch (err) {
      callback({
        status: "error",
        message: err instanceof AppError ? err.message : "Failed to fetch data",
      });
    }
  };

const updateOneSocket =
  (Model, folderName = "", fieldName) =>
  async ({ id, updates }, callback, io) => {
    try {
      if (updates.files && updates.files.length > 0) {
        const uploadPromises = updates.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: folderName,
          })
        );
        const uploadedImages = await Promise.all(uploadPromises);

        updates[fieldName] = uploadedImages.map((img) => ({
          url: img.secure_url,
          public_id: img.public_id,
          original_filename: img.original_filename,
          format: img.format,
        }));
      }

      const doc = await Model.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        throw new AppError("No document found with that ID", 404);
      }

      emitEvent(io, `${Model.modelName.toLowerCase()}-updated`, doc);

      callback({ status: "success", message: "Updated successfully", doc });
    } catch (err) {
      callback({
        status: "error",
        message: err instanceof AppError ? err.message : "Update failed",
      });
    }
  };

const deleteOneSocket =
  (Model) =>
  async ({ id }, callback, io) => {
    try {
      const doc = await Model.findById(id);
      if (!doc) {
        throw new AppError("No document found with that ID", 404);
      }

      if (Array.isArray(doc.image) && doc.image.length > 0) {
        const deletePromises = doc.image.map((file) =>
          cloudinary.uploader.destroy(file.public_id)
        );
        await Promise.all(deletePromises);
      }

      await doc.deleteOne();

      emitEvent(io, `${Model.modelName.toLowerCase()}-deleted`, id);

      callback({ status: "success", message: "Deleted successfully" });
    } catch (err) {
      callback({
        status: "error",
        message: err instanceof AppError ? err.message : "Delete failed",
      });
    }
  };

module.exports = {
  createOneSocket,
  getAllSocket,
  updateOneSocket,
  deleteOneSocket,
};
