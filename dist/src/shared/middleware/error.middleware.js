export const errorMiddleware = (error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || "Something went wrong",
        error: error.error,
    });
};
