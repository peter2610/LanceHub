const Joi = require('joi');

// Validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
    role: Joi.string().valid('CLIENT', 'WRITER').required()
  }),

  createAssignment: Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    amount: Joi.number().min(50).required(),
    deadline: Joi.date().iso().required(),
    requirements: Joi.string().optional()
  }),

  assignWriter: Joi.object({
    writerId: Joi.number().integer().positive().required(),
    writerName: Joi.string().min(2).required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED').required(),
    notes: Joi.string().optional()
  }),

  bulkAssign: Joi.object({
    assignmentIds: Joi.array().items(Joi.string()).min(1).required(),
    writerId: Joi.number().integer().positive().required(),
    writerName: Joi.string().min(2).required()
  }),

  bulkDelete: Joi.object({
    assignmentIds: Joi.array().items(Joi.string()).min(1).required()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        error: 'Invalid request data',
        details: errorDetails
      });
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};
