// eslint-disable-next-line no-unused-vars
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../utils/cloudinary");
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      message: "Deleted successfully",
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Updated successfully",
      data: doc,
    });
  });

const createOne = (Model, idField, idField2) =>
  catchAsync(async (req, res, next) => {
    if (!req.body[idField]) {
      req.body[idField] = req.user.id;
    }
    if (idField2 && !req.body[idField2]) {
      req.body[idField2] = req.params.id;
    }

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Created successfully",
      data: doc,
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
      data: doc,
    });
  });

const getAll = (Model, filterField, popOptions = []) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.id) {
      filter[filterField] = req.params.id;
    }

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

    const docs = await features.query;
    const totalDocuments = await Model.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: docs.length,
      totalDocuments,
      data: docs,
    });
  });

const isOwner = (Model, ownerField) =>
  catchAsync(async (req, res, next) => {
    console.log("Checking ownership for user:", req.user.id);

    // Find the document where the owner matches the logged-in user
    const doc = await Model.findOne({ [ownerField]: req.user.id });

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    console.log("Found Document:", doc);

    // Continue if user owns the resource
    next();
  });

const uploadImages = (Model, folderPath) =>
  catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    const imageFiles = req.files.filter((file) =>
      file.mimetype.startsWith("image/")
    );
    if (imageFiles.length === 0) {
      return next(
        new AppError("Only image files are allowed. Please try again.", 400)
      );
    }

    try {
      const uploadPromises = imageFiles.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: folderPath })
      );

      const uploadResults = await Promise.all(uploadPromises);

      uploadResults.forEach((result) => {
        document.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      });

      await document.save();

      res.status(200).json({
        status: "success",
        message: "Images uploaded and saved successfully.",
        data: {
          document,
        },
      });
    } catch (error) {
      return next(
        new AppError("Failed to upload images. Please try again.", 500)
      );
    }
  });

const removeImage = (Model) =>
  catchAsync(async (req, res, next) => {
    const publicId = req.body.public_id;

    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    const imageIndex = document.images.findIndex(
      (image) => image.public_id === publicId
    );
    if (imageIndex === -1) {
      return next(new AppError("Image not found in document", 404));
    }

    try {
      await cloudinary.uploader.destroy(publicId);

      document.images.splice(imageIndex, 1);
      await document.save();

      res.status(200).json({
        status: "success",
        message: "Image removed successfully from Cloudinary and database.",
        data: { document },
      });
    } catch (error) {
      return next(
        new AppError(
          "Failed to remove image from Cloudinary. Please try again.",
          500
        )
      );
    }
  });

export {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
  isOwner,
  uploadImages,
  removeImage,
};
