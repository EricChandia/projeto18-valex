import joi from 'joi';



export const rechargeCardSchema = joi.object(
    {
      id: joi.number().integer().positive().required(),
      value: joi.number().integer().positive().required()
    }
  )