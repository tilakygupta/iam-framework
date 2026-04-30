import Sidebar from '../../components/Sidebar';
import {useState,useEffect} from 'react';
import api from '../../services/api';

export default function RoleMaster(){
const[list,setList]=useState([]);
const[role_name,setName]=useState('');
const[role_code,setCode]=useState('');
const[description,setDesc]=useState('');

const load=()=>api.get('/roles').then(r=>setList(r.data));
useEffect(()=>{load()},[])

const save=async()=>{
await api.post('/roles',{role_name,role_code,description});
load();
}

return(
<div className='layout'>
<Sidebar/>
<div className='main'>
<h2>Role Management</h2>
<input placeholder='Role Name' onChange={e=>setName(e.target.value)}/>
<input placeholder='Role Code' onChange={e=>setCode(e.target.value)}/>
<input placeholder='Description' onChange={e=>setDesc(e.target.value)}/>
<button onClick={save}>Save</button>

<table border='1' cellPadding='10'>
<tr><th>ID</th><th>Role</th><th>Code</th></tr>
{list.map(x=>(
<tr key={x.role_id}>
<td>{x.role_id}</td>
<td>{x.role_name}</td>
<td>{x.role_code}</td>
</tr>
))}
</table>
</div>
</div>
)
}