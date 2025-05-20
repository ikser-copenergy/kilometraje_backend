import { Router } from 'express';
import * as KilometrajeController from '../controllers/kilometraje.controller';
import { validateKilometrajeBody } from '../middlewares/validateKilometraje';

const router = Router();

router.get('/', KilometrajeController.getAll);
router.get('/:id', KilometrajeController.getById); 
router.post('/', validateKilometrajeBody, KilometrajeController.create);
router.put('/:id', validateKilometrajeBody, KilometrajeController.update);
router.delete('/:id', KilometrajeController.remove);

export default router;
