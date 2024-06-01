import couponModel from "../../../DB/model/coupn.model.js";

export const addCoupon = async (req, res, next) => {
  const { name } = req.body;

  if (await couponModel.findOne({ name })) {
    return next(new Error(`coupon ${name} already exist`, { cause: 409 }));
  }

  req.body.expireDate = new Date(req.body.expireDate);

  const coupon = await couponModel.create(req.body);

  return res.status(201).json({ coupon });
};
