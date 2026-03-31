export const errorHandler = (err, req, res, next) => {
  console.error(err); 
  res.status(err.status || 500); 
  res.render('error', { error: err });
};
