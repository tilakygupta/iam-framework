import Sidebar from '../../components/Sidebar';
import {useState,useEffect} from 'react';
import api from '../../services/api';

export default function UserRoleMapping(){

const [users,setUsers]=useState([]);
const [roles,setRoles]=useState([]);
const [list,setList]=useState([]);

const [user_id,setUser]=useState('');
const [role_id,setRole]=useState('');

const loadData=()=>{

 api.get('/users').then(r=>setUsers(r.data));
 api.get('/roles').then(r=>setRoles(r.data));

 // optional: create backend GET API for mappings
 // api.get('/user-role-map').then(r=>setList(r.data));

}

useEffect(()=>{
 loadData();
},[]);


const save=async()=>{

 if(!user_id || !role_id){
   alert('Select User and Role');
   return;
 }

 try{

   await api.post('/user-role-map',{
     user_id,
     role_id,
     effective_from:'2026-01-01',
     effective_to:'2027-01-01'
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
<div className="mappingBox">

<h2>User Role Mapping</h2>

<select value={user_id} onChange={e=>setUser(e.target.value)}>
<option value=''>Select User</option>
{users.map(u=>(
<option key={u.user_id} value={u.user_id}>
{u.first_name} {u.last_name}
</option>
))}
</select>

<select value={role_id} onChange={e=>setRole(e.target.value)}>
<option value=''>Select Role</option>
{roles.map(r=>(
<option key={r.role_id} value={r.role_id}>
{r.role_name}
</option>
))}
</select>

<button onClick={save}>Map Role</button>

</div>
</div>
</div>
)
}

