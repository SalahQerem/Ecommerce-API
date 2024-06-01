import orderModel from "../../../DB/model/order.model.js";
import reviewModel from "../../../DB/model/review.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const addReview = async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "deliverd",
    "products.productId": productId,
  });
  if (!order) {
    return next(new Error("can't review this order", { cause: 400 }));
  }

  const checkReview = await reviewModel.findOne({
    userId: req.user._id,
    productId: productId,
  });
  if (checkReview) {
    return next(new Error("already review this order", { cause: 400 }));
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/${productId}/reviews` }
    );
    req.body.image = { secure_url, public_id };
  }

  const review = await reviewModel.create({
    comment,
    rating,
    productId,
    userId: req.user._id,
    image: req.body.image,
  });

  return res.status(200).json({ review });
};
