import Sidebar from '../../components/Sidebar';
import {useState,useEffect} from 'react';
import api from '../../services/api';

export default function RolePermissionMapping(){

const [roles,setRoles]=useState([]);
const [permissions,setPermissions]=useState([]);

const [role_id,setRole]=useState('');
const [permission_id,setPermission]=useState('');

useEffect(()=>{

 api.get('/roles').then(r=>setRoles(r.data));
 api.get('/permissions').then(r=>setPermissions(r.data));

},[]);


const save=async()=>{

 if(!role_id || !permission_id){
   alert('Select Role and Permission');
   return;
 }

 try{

   await api.post('/role-permission-map',{
     role_id,
     permission_id
   });

   alert('Mapped Successfully');

 }catch(err){

   alert('Mapping Failed');

 }

}


return(
<div className='layout'>
<Sidebar/>

<div className='main'>
<div className='mappingBox'>

<h2>Role Permission Mapping</h2>

<select value={role_id} onChange={e=>setRole(e.target.value)}>
<option value=''>Select Role</option>
{roles.map(r=>(
<option key={r.role_id} value={r.role_id}>
{r.role_name}
</option>
))}
</select>

<select value={permission_id} onChange={e=>setPermission(e.target.value)}>
<option value=''>Select Permission</option>
{permissions.map(p=>(
<option key={p.permission_id} value={p.permission_id}>
{p.permission_name}
</option>
))}
</select>

<button onClick={save}>Map Permission</button>

</div>
</div>
</div>
)
}

