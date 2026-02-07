import { body, validationResult } from 'express-validator';

/**
 * Validation middleware to check for validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * Login validation rules
 */
export const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Student query validation
 */
export const studentQueryValidation = [
    body('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    body('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    body('search').optional().isString().trim(),
    body('batch').optional().isString().trim(),
    body('department').optional().isString().trim()
];

/**
 * Upload file validation
 */
export const uploadValidation = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }

    const allowedMimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ];

    if (!allowedMimes.includes(req.file.mimetype) && !req.file.originalname.match(/\.(xlsx|xls|csv)$/)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed'
        });
    }

    if (req.file.size > 10 * 1024 * 1024) { // 10MB
        return res.status(400).json({
            success: false,
            message: 'File size exceeds 10MB limit'
        });
    }

    next();
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
};
