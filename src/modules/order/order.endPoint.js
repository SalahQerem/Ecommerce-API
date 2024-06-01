import { roles } from "../../middleware/auth.js";

export const endpoints = {
  create: [roles.User],
  getAll: [roles.Admin],
  userOrders: [roles.User],
  updateOrder: [roles.Admin],
};
