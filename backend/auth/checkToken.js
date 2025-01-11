import jwt from "jsonwebtoken";
const { verify } = jwt;

export const checkToken = (req, res, next) => {
  let token = req.get("authorization");
  if (token) {
    token = token.slice(7);
    verify(token, "qwe1234", (error, decoded) => {
      if (error) {
        return res.json({
          success: 0,
          message: "Invalid token",
        });
      } else {
        req.companyName = decoded.username; // Attach companyName to the request object
        console.log("Request company name is", req.companyName);
        next();
      }
    });
  } else {
    return res.json({
      success: 0,
      message: "Access denied: You are unauthorized!",
    });
  }
};
