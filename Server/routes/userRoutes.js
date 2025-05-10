// Server/routes/userRoutes.js
import { loginUser, registerUser, crearAdmin } from '../controllers/userController.js';
import { Router } from 'express';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/crear-admin', crearAdmin);

export default router;
