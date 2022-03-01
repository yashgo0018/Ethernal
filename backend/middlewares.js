const { validationResult } = require("express-validator")

module.exports = {
    validate(req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        next();
    }
}