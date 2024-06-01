import cartModel from "../../../DB/model/cart.model.js";
import couponModel from "../../../DB/model/coupn.model.js";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import userModel from "../../../DB/model/user.model.js";

export const addOrder = async (req, res, next) => {
  const { couponName } = req.body;

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    return next(new Error(`cart is empty`, { cause: 400 }));
  }

  req.body.products = cart.products;

  if (couponName) {
    const coupon = await couponModel.findOne({ name: couponName });

    if (!coupon) {
      return next(new Error(`coupon not found`, { cause: 404 }));
    }

    const currentDate = new Date();
    if (coupon.expireDate <= currentDate) {
      return next(new Error(`this coupon has expried`, { cause: 400 }));
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return next(new Error(`coupon already used`, { cause: 409 }));
    }

    req.body.coupon = coupon;
  }

  let subTotals = 0;
  let finalProductList = [];
  for (let product of req.body.products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });

    if (!checkProduct) {
      return next(new Error(`product quantity not available`));
    }

    product = product.toObject();

    product.name = checkProduct.name;
    product.unitPrice = checkProduct.price;
    product.discount = checkProduct.discount;
    product.finalPrice = product.quantity * checkProduct.finalPrice;
    subTotals += product.finalPrice;

    finalProductList.push(product);
  }

  const user = await userModel.findById(req.user._id);
  if (!req.body.address) {
    req.body.address = user.address;
  }
  if (!req.body.phone) {
    req.body.phone = user.phone;
  }

  const order = await orderModel.create({
    userId: req.user._id,
    products: finalProductList,
    finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
    address: req.body.address,
    phoneNumber: req.body.phone,
  });

  for (const product of req.body.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  if (req.body.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }

  await cartModel.updateOne(
    { userId: req.user._id },
    {
      products: [],
    }
  );

  return res.status(201).json({ order });
};

export const getOrders = async (req, res) => {
  const orders = await orderModel.find({
    $or: [
      {
        status: "pending",
      },
      {
        status: "confirmed",
      },
    ],
  });
  return res.status(200).json({ orders });
};

export const getUserOrders = async (req, res) => {
  const order = await orderModel.find({ userId: req.user._id });
  return res.status(200).json({ order });
};

export const changeStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new Error("order not found", { cause: 404 }));
  }

  order.status = status;
  await order.save();

  return res.status(200).json({ order });
};
