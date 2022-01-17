const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// visualizar
router.get('/', userController.view);

// encontrar
router.post('/', userController.find);

// cadastar
router.get('/addproduto', userController.form);
router.post('/addproduto', userController.create);

//editar
router.get('/editproduto/:id', userController.edit);
router.post('/editproduto/:id', userController.update);

//deletar
router.get('/:id', userController.delete);

module.exports = router;