// Extra Credit -- see lines 12-18

// handler function to wrap each route
exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error) {
            // forward error to the global error handler
            // next(error);
            
            // handle error here
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    }
}