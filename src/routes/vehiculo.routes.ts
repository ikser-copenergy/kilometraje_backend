import { Router } from 'express';
import * as VehiculoController from '../controllers/vehiculo.controller';
import { validateVehiculoBody } from '../middlewares/validateVehiculo';

const router = Router();

router.get('/', VehiculoController.getAll);
router.get('/:id', VehiculoController.getById); 
router.post('/', validateVehiculoBody, VehiculoController.create);
router.put('/:id', validateVehiculoBody, VehiculoController.update);
router.delete('/:id', VehiculoController.remove);

export default router;
