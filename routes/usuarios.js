const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete 
} = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de al menos 6 caracteres').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail().custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
] ,usuariosPost);
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId().custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
],
usuariosPut);
router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId().custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;