import slugify from "slugify";
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { pagination } from "../../utils/pagination.js";

export const addSubCategory = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const { categoryId } = req.body;

  const subCategory = await subCategoryModel.findOne({ name });
  if (subCategory) {
    return next(
      new Error(`sub category with name:${name} already exists`, { cause: 409 })
    );
  }

  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "category not found" });
    return next(new Error("email not found", { cause: 400 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/subCategories`,
    }
  );

  const newSubCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    categoryId,
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return res.status(201).json({ subCategory: newSubCategory });
};

export const getSubCategories = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const { categoryId } = req.params;

  const category = await categoryModel
    .findById(categoryId)
    .skip(skip)
    .limit(limit);
  if (!category) {
    return next(new Error("category not found", { cause: 400 }));
  }

  const subCategory = await subCategoryModel.find({ categoryId }).populate({
    path: "categoryId",
  });

  return res.status(200).json({ count: subCategory.length, subCategory });
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
    return next(new Error(`Sub Category not found`, { cause: 404 }));
  }

  return res
    .status(200)
    .json({ message: "success", count: subCategory.length, subCategory });
};

export const getSubCategoryById = async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.id);
  if (!subCategory) {
    return next(new Error(`subcategory not found`, { cause: 404 }));
  }

  return res.status(200).json({ subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.id);
  if (!subCategory) {
    return next(
      new Error(`invalid subcategory id ${req.params.id}`, { cause: 404 })
    );
  }

  subCategory.name = req.body.name.toLowerCase();
  if (
    await subCategoryModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    })
  ) {
    return next(
      new Error(`Sub Category ${req.body.name} already exists`, { cause: 409 })
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
    return next(new Error(`subcategroy not found`, { cause: 404 }));
  }

  await cloudinary.uploader.destroy(subCategory.image.public_id);

  return res.status(200).json({ message: "success" });
};
