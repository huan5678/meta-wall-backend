const successHandle = (res, message = '', data) => {
    typeof data === 'array' || typeof data === 'object' || data?.length > 1
      ? res.status(200).send({
          status: true,
          message: message,
          data,
        })
      : res.status(200).send({
          status: true,
          message: message,
        });
  };
  
  module.exports = successHandle;