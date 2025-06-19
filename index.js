import express from "express";
import path from "path";
import morgan from "morgan";
import router from './backend/routes/submitRouter.js';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './backend/config/swagger.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/',router);

app.use(express.static(path.join(__dirname, "frontend")));

app.listen(PORT ,() => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});