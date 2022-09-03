import joi from 'joi';

export const createCardSchema = joi.object({
    employeeId: joi.number().required(),
    cardType: joi.any().valid('groceries', 'restaurants', 'transport', 'education', 'health').required(),
  });
  

export const activateCardSchema = joi.object({
  id: joi.number().integer().positive().required(),
  cvv: joi.string().pattern(/^[0-9]{3}$/),
  password: joi.string().pattern(/^[0-9]{4}$/)
});

export const blockCardSchema = joi.object(
  {
    id: joi.number().integer().positive().required(),
    password: joi.string().pattern(/^[0-9]{4}$/)
  }
)