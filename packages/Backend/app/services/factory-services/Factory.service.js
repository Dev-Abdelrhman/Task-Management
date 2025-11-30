const cloudinary = require("../../utils/cloudinary.js");
const { set, get } = require("lodash");
const catchAsync = require("../../utils/catchAsync.js");
const AppError = require("../../utils/appError.js");
const APIFeatures = require("../../utils/apiFeatures.js");
const upload = require("../../utils/multer.js");
const { emitEvent } = require("../../utils/eventLogger.js");

const uploader = (fieldName, maxCount) => {
  return upload.array(fieldName, maxCount);
};

const deleteOne = (Model, filterField) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    if (Array.isArray(doc.image) && doc.image.length > 0) {
      const deletePromises = doc.image.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );
      await Promise.all(deletePromises);
    }

    await doc.deleteOne();

    emitEvent(
      req.app.get("io"),
      `${Model.modelName.toLowerCase()}-deleted`,
      req.params.id
    );

    res.status(204).json({
      status: "success",
      message: `Document deleted successfully.`,
    });
  });

const updateOne = (Model, folderName = "", fieldName) =>
  catchAsync(async (req, res, next) => {
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: folderName,
        })
      );
      const uploadedImages = await Promise.all(uploadPromises);

      req.body[fieldName] = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
        original_filename: img.original_filename,
        format: img.format,
      }));
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    emitEvent(
      req.app.get("io"),
      `${Model.modelName.toLowerCase()}-updated`,
      doc
    );

    res.status(200).json({
      status: "success",
      message: "Updated successfully",
      doc,
    });
  });

const createOne = (Model, folderName = "", fieldName, idField, idField2) =>
  catchAsync(async (req, res, next) => {
    if (idField) {
      if (!get(req.body, idField)) {
        set(req.body, idField, req.user.id);
      }
    }
    if (idField2) {
      if (!get(req.body, idField2)) {
        set(req.body, idField2, req.params.id);
      }
    }
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: folderName,
          })
        )
      );
      req.body[fieldName] = uploadResults.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
        original_filename: result.original_filename,
        format: result.format,
      }));
    }

    const doc = await Model.create(req.body);

    emitEvent(
      req.app.get("io"),
      `${Model.modelName.toLowerCase()}-created`,
      doc
    );

    res.status(201).json({
      status: "success",
      message: "Created successfully",
      doc,
    });
  });

const getOne = (Model, popOptions = []) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (Array.isArray(popOptions) && popOptions.length > 0) {
      popOptions.forEach((pop) => {
        query = query.populate(pop);
      });
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      doc,
    });
  });

const getAll = (Model, filterField, popOptions = [], additionalFilter = {}) =>
  catchAsync(async (req, res, next) => {
    const filterValue = req.params.id || req.user?.id;

    const filter = {
      ...(filterField ? { [filterField]: filterValue } : {}),
      ...additionalFilter,
    };

    let query = Model.find(filter);

    if (Array.isArray(popOptions) && popOptions.length > 0) {
      popOptions.forEach((pop) => {
        query = query.populate(pop);
      });
    }

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      doc,
    });
  });

const isOwner = (Model, ownerField) =>
  catchAsync(async (req, res, next) => {
    const resourceId = req.params.id;

    const doc = await Model.findById(resourceId);
    if (!doc) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }
    if (doc[ownerField].equals(req.user.id)) {
      return next();
    }

    next(new AppError("You are not authorized to access this resource", 403));
  });

const removeFile = (Model, fieldName) =>
  catchAsync(async (req, res, next) => {
    const publicId = req.body.public_id;

    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    const fileIndex = document[fieldName].findIndex(
      (file) => file.public_id === publicId
    );
    if (fileIndex === -1) {
      return next(
        new AppError(`${fieldName.slice(0, -1)} not found in document`, 404)
      );
    }
    await cloudinary.uploader.destroy(publicId);

    document[fieldName].splice(fileIndex, 1);
    await document.save();

    res.status(200).json({
      status: "success",
      message: `${fieldName.slice(
        0,
        -1
      )} removed successfully from Cloudinary and database.`,
      data: { document },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
  isOwner,
  removeFile,
  uploader,
};
