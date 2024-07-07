import slugify from "slugify";
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import { AppError } from "../../utls/AppError.js";

export const addSubCategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const { categoryId } = req.body;
  const subcategory = await subCategoryModel.findOne({ name });
  if (subcategory) {
    return next(new AppError(`sub category ${name} already exists`, 409));
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new AppError(`category not found`, 404));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/subcategories`,
    }
  );
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    categoryId,
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  return res.status(201).json({ message: "success", subCategory });
};

export const getSubCategories = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const { categoryId } = req.params;
  const category = await categoryModel
    .findById(categoryId)
    .skip(skip)
    .limit(limit);
  if (!category) {
    return next(new AppError(`category not found`, 404));
  }
  const subcategory = await subCategoryModel.find({ categoryId }).populate({
    path: "categoryId",
  });
  return res
    .status(200)
    .json({ message: "success", count: subcategory.length, subcategory });
};

export const getActiveSubCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  const subCategory = await subCategoryModel
    .find({ categoryId, status: "Active" })
    .skip(skip)
    .limit(limit)
    .select("name image");

  if (!subCategory) {
    return next(new AppError(`subcategory not found`, 404));
  }

  return res
    .status(200)
    .json({ message: "success", count: subCategory.length, subCategory });
};

export const getSubCategoryById = async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.id);
  if (!subCategory) {
    return next(new AppError(`subcategory not found`, 404));
  }

  return res.status(200).json({ subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.id);
  if (!subCategory) {
    return next(new AppError(`invalid subcategory id ${req.params.id}`, 404));
  }

  subCategory.name = req.body.name.toLowerCase();
  if (
    await subCategoryModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    })
  ) {
    return next(
      new AppError(`subcategory ${req.body.name} already exists`, 409)
    );
  }

  subCategory.slug = slugify(req.body.name);
  subCategory.status = req.body.status;

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/subcategories` }
    );
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    subCategory.image = { secure_url, public_id };
  }

  subCategory.updatedBy = req.user._id;
  await subCategory.save();

  return res.status(200).json({ message: "success" });
};

export const deleteSubCategory = async (req, res, next) => {
  const subCategory = await subCategoryModel.findByIdAndDelete(req.params.id);
  if (!subCategory) {
    return next(new AppError(`subcategroy not found`, 404));
  }

  await cloudinary.uploader.destroy(subCategory.image.public_id);

  return res.status(200).json({ message: "success" });
};
