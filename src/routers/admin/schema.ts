import Joi from "joi";

export const createCameraSchema = Joi.object({
    ipAddress: Joi.string()
        .ip({ version: ["ipv4", "ipv6"] })
        .required(),
    name: Joi.string().min(3).max(100).required(),
    cameraId: Joi.string().required(),
    ptzEnabled: Joi.boolean().required(),
    rtspUrl: Joi.string().uri().optional().allow(null),
    ptzUrl: Joi.string().uri().optional().allow(null),
});

export const createOperatorSchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(30).required(),
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(100).required(),
});
