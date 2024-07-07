import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../utls/cloudinary.js";
import { pagination } from "../../utls/pagination.js";
import { AppError } from "../../utls/AppError.js";

export const AddCategory = async (req, res, next) => {
  const { name } = req.body;

  if (await categoryModel.findOne({ name: name.toLowerCase() })) {
    return next(new AppError(`category name already exists`, 409));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/categories` }
  );

  const category = await categoryModel.create({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return res
    .status(201)
    .json({ message: "New Category added successfully", category });
};

export const getCategories = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  const categories = await categoryModel
    .find({})
    .skip(skip)
    .limit(limit)
    .populate("subCategory");

  return res.status(200).json({ categories });
};

export const getActiveCategories = async (req, res) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);

  const categories = await categoryModel
    .find({ status: "Active" })
    .skip(skip)
    .limit(limit)
    .select("name image");

  return res.status(200).json({ categories });
};

export const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new AppError(`category not found`, 404));
  }

  return res.status(200).json({ category });
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new AppError(`invalid category id ${req.params.id}`, 404));
  }

  category.name = req.body.name.toLowerCase();

  if (
    await categoryModel.findOne({
      name: req.body.name,
      _id: { $ne: id },
    })
  ) {
    return next(new AppError(`category ${req.body.name} already exists`, 409));
  }

  category.slug = slugify(req.body.name);
  category.status = req.body.status;

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/categories` }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }

  category.updatedBy = req.user._id;
  await category.save();

  return res.status(202).json({ message: "Category updated successfully" });
};

export const deleteCategory = async (req, res, next) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError(`categroy not found`, 404));
  }

  await cloudinary.uploader.destroy(category.image.public_id);

  return res.status(201).json({ message: "Category deleted successfully" });
};
