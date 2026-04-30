import Sidebar from '../../components/Sidebar';
import {useEffect,useState} from 'react';
import api from '../../services/api';

export default function UserMaster(){
const[list,setList]=useState([]);

useEffect(()=>{
api.get('/users').then(r=>setList(r.data));
},[])

return(
<div className='layout'>
<Sidebar/>
<div className='main'>
<h2>User Management</h2>
<table border='1' cellPadding='10'>
<tr>
<th>ID</th>
<th>Name</th>
<th>Email</th>
</tr>
{list.map(x=>(
<tr key={x.user_id}>
<td>{x.user_id}</td>
<td>{x.first_name} {x.last_name}</td>
<td>{x.email}</td>
</tr>
))}
</table>
</div>
</div>
)
}