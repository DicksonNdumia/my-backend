//writing my own middleware to  show the endpoint hit
export const myLogger = function (req, res, next) {
  console.log(`http://localhost:3000${req.url}`);
  next();
};
