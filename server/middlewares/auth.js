import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token authorization is required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, "jwt-secret");

    req.user = { _id: payload._id };

    next();
  } catch (error) {
    // console.log(error);
    return res.status(401).json({ error: "Unauthorized resquest" });
  }
};

export default auth;
