import {useEffect,useState} from 'react';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function PermissionMaster(){

const[list,setList]=useState([]);

const[permission_name,setP]=useState('');
const[resource_name,setR]=useState('');
const[action_name,setA]=useState('');

const load=()=>{
 api.get('/permissions').then(r=>setList(r.data));
}

useEffect(()=>{
 load();
},[]);

const save=async()=>{
 await api.post('/permissions',{
   permission_name,
   resource_name,
   action_name
 });
 load();
}

return(
<div className='layout'>
<Sidebar/>
<div className='main'> 
<div>

<h2>Permission Management</h2>

<input
placeholder='Permission'
onChange={e=>setP(e.target.value)}
/>

<input
placeholder='Resource'
onChange={e=>setR(e.target.value)}
/>

<input
placeholder='Action'
onChange={e=>setA(e.target.value)}
/>

<button onClick={save}>Save</button>

<br/><br/>

<table border='1' cellPadding='10'>

<tr>
<th>ID</th>
<th>Permission</th>
<th>Resource</th>
<th>Action</th>
</tr>

{list.map(x=>(
<tr key={x.permission_id}>
<td>{x.permission_id}</td>
<td>{x.permission_name}</td>
<td>{x.resource_name}</td>
<td>{x.action_name}</td>
</tr>
))}

</table>

</div>
</div>
</div>
)

}

