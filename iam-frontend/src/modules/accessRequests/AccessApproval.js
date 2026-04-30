import {useEffect,useState} from 'react';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function AccessApproval(){

const [list,setList]=useState([]);

useEffect(()=>{
 load();
},[]);

const load = ()=>{
 api.get('/access-requests')
 .then(r=>setList(r.data));
};

const approve = async(id)=>{
 await api.put(`/approve-request/${id}`);
 alert('Approved');
 load();
};

const reject = async(id)=>{
 await api.put(`/reject-request/${id}`);
 alert('Rejected');
 load();
};

return(

<div className='layout'>

<Sidebar/>

<div className='main'>

<h2>Access Requests</h2>

<table border='1' cellPadding='10'>

<tr>
<th>ID</th>
<th>User</th>
<th>Role</th>
<th>Status</th>
<th>Action</th>
</tr>

{list.map(x=>(
<tr key={x.request_id}>

<td>{x.request_id}</td>
<td>{x.user_id}</td>
<td>{x.requested_role_id}</td>
<td>{x.approval_status}</td>

<td>

{x.approval_status === 'PENDING' && (
<>
<button onClick={()=>approve(x.request_id)}>
Approve
</button>

<button onClick={()=>reject(x.request_id)}>
Reject
</button>
</>
)}

</td>

</tr>
))}

</table>

</div>

</div>

);

}