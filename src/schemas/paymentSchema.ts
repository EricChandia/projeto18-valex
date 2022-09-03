import joi from 'joi';

export const paymentSchema = joi.object({
    cardId: joi.number().integer().positive().required(),
    cardPassword: joi.string().pattern(/^[0-9]{4}$/).required(),
    businessId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
  });
  