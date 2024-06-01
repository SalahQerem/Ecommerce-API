import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import productModel from "../../../DB/model/product.model.js";
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const getproduct = async (req, res) => {
  return res.json({ message: "success" });
};

export const AddProduct = async (req, res) => {
  const { name, price, discount, categoryId, subCategoryId } = req.body;

  const checkCategory = await categoryModel.findById(categoryId);
  if (!checkCategory) {
    return res.status(404).json({ message: "category not found" });
  }

  // const checkSubCategory = await subCategoryModel.findById(subCategoryId);
  const checkSubCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (subCategoryId) {
    if (!checkSubCategory) {
      return res.status(404).json({ message: "Sub Category not found" });
    }
  }

  req.body.slug = slugify(name);
  req.body.finalPrice = price - ((price * (discount || 0)) / 100).toFixed(2);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/${req.body.name}/mainImages` }
  );

  req.body.mainImage = { secure_url, public_id };
  req.body.subImages = [];

  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.APP_NAME}/product/${req.body.name}/subimages` }
    );
    req.body.subImages.push({ secure_url, public_id });
  }

  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;

  const product = await productModel.create(req.body);
  if (!product) {
    return res.status(400).json({ message: "error while creating product" });
  }

  return res.status(201).json({ product });
};
