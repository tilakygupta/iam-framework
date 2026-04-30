const router = require('express').Router();

const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/rbacMiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/* -------- LOGIN -------- */
router.post('/auth/login', (req,res)=>{

const {email,password}=req.body;

db.query(
'SELECT * FROM users WHERE email=?',
[email],

async(err,result)=>{

if(result.length===0){
return res.status(404).json('User not found');
}

const user=result[0];

const valid=await bcrypt.compare(password,user.password_hash);

if(!valid){
return res.status(401).json('Wrong Password');
}

/* ✅ GET ONLY ACTIVE ROLE */
const roleSql=`
SELECT r.role_id, r.role_name
FROM user_roles ur
JOIN roles r ON ur.role_id = r.role_id
WHERE ur.user_id=?
AND CURDATE() BETWEEN ur.effective_from AND ur.effective_to
ORDER BY ur.effective_from DESC
LIMIT 1`;

db.query(roleSql,[user.user_id],(e,roleRes)=>{

if(roleRes.length===0){
return res.status(403).json('No Role Assigned');
}

const role = roleRes[0];

/* ✅ GET PERMISSIONS ONLY FOR THAT ROLE */
const permSql=`
SELECT p.permission_name
FROM permissions p
JOIN role_permissions rp ON p.permission_id=rp.permission_id
WHERE rp.role_id=?;`;

db.query(permSql,[role.role_id],(e,pr)=>{

const perms = pr.map(x=>x.permission_name);

const token = jwt.sign(
{
id:user.user_id,
role:role.role_name,
permissions:perms
},
'mysecretkey'
);

res.json({
token,
user:{
id:user.user_id,
name:user.first_name,
role:role.role_name
}
});

});

});

});
});



/* -------- REGISTER -------- */

router.post('/auth/register', async (req,res)=>{

 const {
   first_name,
   middle_name,
   last_name,
   email,
   phone,
   password
 } = req.body;

 const hash = await bcrypt.hash(password,10);

 db.query(
 `INSERT INTO users
 (first_name,middle_name,last_name,email,phone,password_hash,status,created_by,created_at)
 VALUES (?,?,?,?,?,?, 'ACTIVE','tilakygupta', NOW())`,
 [
   first_name,
   middle_name,
   last_name,
   email,
   phone,
   hash
 ],
 (err)=>{
   if(err) return res.status(500).json(err);

   res.json({
     message:'User Registered'
   });
 });

});


/* ---------------- ROLES ---------------- */

router.get('/roles', auth,  (req,res)=>{

 db.query(
   'SELECT * FROM roles',
   (err,result)=>{
      res.json(result);
   }
 );

});


router.post('/roles', auth, checkPermission('CREATE_ROLE'), (req,res)=>{

 const {
   role_name,
   role_code,
   description
 } = req.body;

 db.query(
 `INSERT INTO roles
 (role_name,role_code,description,created_by,created_at)
 VALUES (?,?,?,?,NOW())`,
 [
   role_name,
   role_code,
   description,
   'tilakygupta'
 ],
 ()=>res.json('Role Added')
 );

});


/* ---------------- PERMISSIONS ---------------- */

router.get('/permissions', auth, checkPermission('ASSIGN_PERMISSION'), (req,res)=>{

 db.query(
   'SELECT * FROM permissions',
   (e,r)=>res.json(r)
 );

});


router.post('/permissions', auth, checkPermission('ASSIGN_PERMISSION'), (req,res)=>{

 const {
   permission_name,
   resource_name,
   action_name
 } = req.body;

 db.query(
 `INSERT INTO permissions
 (permission_name,resource_name,action_name,created_by,created_at)
 VALUES (?,?,?,?,NOW())`,
 [
   permission_name,
   resource_name,
   action_name,
   'tilakygupta'
 ],
 ()=>res.json('Permission Added')
 );

});


/* ---------------- USER ROLE MAP ---------------- */

router.post('/user-role-map', auth, checkPermission('ASSIGN_ROLE'), (req,res)=>{

 const {
   user_id,
   role_id,
   effective_from,
   effective_to
 } = req.body;

 db.query(
 `INSERT INTO user_roles
 (user_id,role_id,effective_from,effective_to,created_by,created_at)
 VALUES (?,?,?,?,?,NOW())`,
 [
   user_id,
   role_id,
   effective_from,
   effective_to,
   'tilakygupta'
 ],
 ()=>res.json('User Role Mapped')
 );

});


/* ---------------- ROLE PERMISSION MAP ---------------- */

router.post('/role-permission-map', auth, checkPermission('ASSIGN_PERMISSION'), (req,res)=>{

 const {
   role_id,
   permission_id
 } = req.body;

 db.query(
 `INSERT INTO role_permissions
 (role_id,permission_id,created_by,created_at)
 VALUES (?,?,?,NOW())`,
 [
   role_id,
   permission_id,
   'tilakygupta'
 ],
 ()=>res.json('Role Permission Mapped')
 );

});


/* ---------------- ACCESS REQUEST ---------------- */

router.post('/access-request', auth, (req,res)=>{

 const {
   requested_role_id,
   justification
 } = req.body;

 db.query(
 `INSERT INTO access_requests
 (user_id,requested_role_id,justification,approval_status,created_at)
 VALUES (?,?,?,?,NOW())`,
 [
   req.user.id,
   requested_role_id,
   justification,
   'PENDING'
 ],
 ()=>res.json('Access Request Submitted')
 );

});




/* ---------------- SESSIONS ---------------- */

router.get('/sessions', auth, (req,res)=>{

 db.query(
 'SELECT * FROM sessions',
 (e,r)=>res.json(r)
 );

});


/* ---------------- AUDIT LOGS ---------------- */

router.get('/audit-logs', auth, checkPermission('VIEW_AUDIT'), (req,res)=>{

 db.query(
 'SELECT * FROM audit_logs ORDER BY audit_id DESC',
 (e,r)=>res.json(r)
 );

});

/* ---------------- USERS ---------------- */

router.get('/users', auth, checkPermission('VIEW_USER'), (req,res)=>{

 db.query(
 'SELECT * FROM users',
 (e,r)=>res.json(r)
 );

});

router.get('/users/:id',auth,(req,res)=>{

const userId = req.params.id;

const sql = `
SELECT u.*, r.role_name
FROM users u

LEFT JOIN user_roles ur 
  ON ur.user_role_id = (
    SELECT ur2.user_role_id
    FROM user_roles ur2
    WHERE ur2.user_id = u.user_id
    AND CURDATE() BETWEEN ur2.effective_from AND ur2.effective_to
    ORDER BY ur2.effective_from DESC
    LIMIT 1
  )

LEFT JOIN roles r 
  ON ur.role_id = r.role_id

WHERE u.user_id=?
`;

db.query(sql,[userId],(err,result)=>{

 if(err) return res.status(500).json(err);

 res.json(result[0]);

});

});

router.get('/access-request',
 auth,
 checkPermission('APPROVE_ACCESS'),
 (req,res)=>{
   db.query(
   'SELECT * FROM access_requests',
   (e,r)=>res.json(r)
   );
});

router.post('/access-request',
 auth,
 (req,res)=>{

 const {requested_role_id, justification} = req.body;

 db.query(
 `INSERT INTO access_requests
 (user_id, requested_role_id, justification, approval_status, created_at)
 VALUES (?,?,?,?,NOW())`,
 [
   req.user.id,              // from JWT
   requested_role_id,
   justification,
   'PENDING'
 ],
 ()=>res.json('Request Sent')
 );

});

router.put('/approve-request/:id',
 auth,
 checkPermission('APPROVE_ACCESS'),
 (req,res)=>{

 const requestId = req.params.id;

 // 1. Get request
 db.query(
 'SELECT * FROM access_requests WHERE request_id=?',
 [requestId],
 (err,result)=>{

   if(err) return res.status(500).json(err);
   if(result.length===0) return res.status(404).json('Not found');

   const reqData = result[0];

   // 2. Expire old role (IMPORTANT)
   db.query(
   `UPDATE user_roles 
    SET effective_to = CURDATE()
    WHERE user_id=? AND effective_to >= CURDATE()`,
   [reqData.user_id],
   (err)=>{

     if(err) return res.status(500).json(err);

     // 3. Insert new role
     db.query(
     `INSERT INTO user_roles
     (user_id, role_id, effective_from, effective_to, created_by, created_at)
     VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?, NOW())`,
     [
       reqData.user_id,
       reqData.requested_role_id,
       'admin'
     ],
     (err)=>{

       if(err) return res.status(500).json(err);

       // 4. Update request status
       db.query(
       `UPDATE access_requests
        SET approval_status='APPROVED', approved_by=?
        WHERE request_id=?`,
       [req.user.id, requestId],
       ()=>res.json('Approved Successfully')
       );

     });

   });

 });

});

router.get('/access-requests',
 auth,
 checkPermission('APPROVE_ACCESS'),
 (req,res)=>{

 db.query(
 'SELECT * FROM access_requests ORDER BY request_id DESC',
 (e,r)=>res.json(r)
 );

});

router.put('/reject-request/:id',
 auth,
 checkPermission('APPROVE_ACCESS'),
 (req,res)=>{

 db.query(
 `UPDATE access_requests
  SET approval_status='REJECTED',
      approved_by=?
  WHERE request_id=?`,
 [
   req.user.id,
   req.params.id
 ],
 ()=>res.json('Request Rejected')
 );

});
module.exports = router;

