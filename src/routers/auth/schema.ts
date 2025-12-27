import Joi from "joi";

export const signInSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
});
