import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation middleware to check for validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
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
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
];

/**
 * Student query validation (for paginated lists)
 */
export const studentQueryValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().trim().escape(),
    query('batch').optional().isString().trim().escape(),
    query('department').optional().isString().trim().escape(),
    query('sortBy').optional().isIn(['rollNumber', 'department', 'batch']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    validate,
];

/**
 * Student ID param validation
 */
export const studentIdValidation = [
    param('id').notEmpty().isString().trim().withMessage('Valid student ID is required'),
    validate,
];

/**
 * Upload file validation middleware (non-express-validator, manual check)
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
 * Strips <script> tags and trims whitespace from all string inputs
 */
export const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key]
                        .trim()
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Strip inline event handlers
                        .replace(/javascript:/gi, ''); // Strip javascript: protocol
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
};
