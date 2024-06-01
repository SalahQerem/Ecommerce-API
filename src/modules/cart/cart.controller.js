import cartModel from "../../../DB/model/cart.model.js";

export const getCart = async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  return res.status(200).json({ cart });
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;

  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: { productId },
    });
    return res.status(201).json({ cart: newCart });
  }

  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId == productId) {
      return res.json({ message: "products already exists" });
    }
  }

  cart.products.push({ productId: productId });
  await cart.save();

  return res.status(201).json({ cart });
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: productId,
        },
      },
    },
    { new: true }
  );

  return res.status(200).json({ cart });
};

export const clearCart = async (req, res) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true }
  );

  return res.status(200).json({ cart });
};

export const updateQuantity = async (req, res) => {
  const { quantity, operator } = req.body;

  const inc = operator == "+" ? quantity : -quantity;

  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id, "products.productId": req.params.productId },
    {
      $inc: {
        "products.$.quantity": inc,
      },
    },
    { new: true }
  );

  if (cart.products.some((product) => product.quantity === 0)) {
    cart.products = cart.products.filter((product) => product.quantity !== 0);
    await cart.save();
  }

  return res.status(200).json({ cart });
};