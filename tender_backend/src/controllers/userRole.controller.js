const { UserRole } = require('../models');
exports.addRole = (req,res,next) => {
try{
     if (req.user.userRoleId !== USER_ROLES.ADMIN.id) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied.Only admins can perform this action'
      });
    }

    UserRole.create(req.body).then(r=>res.status(201).json(r)).catch(next);
}
catch(err){
  next(err);
}

};


exports.updateRole = (req,res,next) => {
    try{
     if (req.user.userRoleId !== USER_ROLES.ADMIN.id) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied.Only admins can perform this action'
      });
    }
    
    UserRole.update(req.body,{where:{id:req.params.id}}).then(()=>res.sendStatus(204)).catch(next);
}
catch(err){
  next(err);
}

};





exports.deleteRole = (req,res,next) => {
        try{
            if (req.user.userRoleId !== USER_ROLES.ADMIN.id) {
            return res.status(403).json({
                type: API_STATUS.ERROR,
                message: 'Access Denied.Only admins can perform this action'
            });
            }

            UserRole.update(
                {isActive:false}
            ,{where:{id:req.params.id}}
            )
            .then(()=>res.sendStatus(204))
            .catch(next);
            }
        catch(err){
        next(err);
        }


    };




    /**
     * @swagger
     * /roles:
     *   get:
     *     summary: Retrieve a list of all roles
     *     tags: 
     *       - Roles
     *     responses:
     *       200:
     *         description: A list of roles
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: The role ID
     *                   name:
     *                     type: string
     *                     description: The name of the role
     *                   isActive:
     *                     type: boolean
     *                     description: Whether the role is active
     *       500:
     *         description: Internal server error
     */
    exports.getAllRoles = (req, res, next) => 
        UserRole.findAll()
            .then(roles => res.status(200).json(roles))
            .catch(next);