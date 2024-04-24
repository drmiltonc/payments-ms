// Importa las bibliotecas dotenv y joi
import * as dotenv from 'dotenv';
import * as joi from 'joi';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Define el esquema de validación para las variables de entorno
const envVarsSchema = joi.object({
    PORT: joi.number().required(),

    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    
}).unknown(true);

// Valida las variables de entorno utilizando el esquema definido
const { error, value: envVars } = envVarsSchema.validate({
    ...process.env,
    
});

// Si hay algún error de validación, lanza una excepción
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Exporta las variables de entorno validadas
export default envVars;
