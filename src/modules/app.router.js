import cors from "cors";
import categoryRouter from "./category/category.router.js";
import productRouter from "./product/product.router.js";
import authRouter from "./auth/auth.router.js";
import subCategoryRouter from "./subCategory/subCategory.router.js";
import cartRouter from "./cart/cart.router.js";
import couponRouter from "./coupon/coupon.router.js";
import orderRouter from "./order/order.router.js";
import reviewRouter from "./review/review.router.js";
import usersRouter from "./user/user.router.js";
import connectDB from "../../DB/connection.js";

const initApp = (app, express) => {
  connectDB();
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "welcome" });
  });

  app.use("/categories", categoryRouter);
  app.use("/auth", authRouter);
  app.use("/sub-categories", subCategoryRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);
  app.use("/coupons", couponRouter);
  app.use("/orders", orderRouter);
  app.use("/reviews", reviewRouter);
  app.use("/users", usersRouter);
  app.use("*", (req, res) => {
    return res.status(404).json({ message: "page not found" });
  });
  app.use((err, req, res, next) => {
    res.status(err.statusCode).json({ message: err.message });
  });
};

export default initApp;
