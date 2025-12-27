import Joi from "joi";

export const ptzPostSchema = Joi.object({
    command: Joi.string()
        .valid("up", "down", "left", "right", "zoom_in", "zoom_out")
        .required(),
});
