import {useState,useEffect} from 'react';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function AccessRequest(){

const [roles,setRoles]=useState([]);
const [role_id,setRole]=useState('');
const [justification,setJustification]=useState('');
const [loading,setLoading]=useState(false);

// ✅ safe permissions read
const perms = JSON.parse(localStorage.getItem('permissions') || '[]');

useEffect(()=>{

// ALWAYS try fetching roles (avoid blank UI)
api.get('/roles')
.then(r=>setRoles(r.data))
.catch(()=>setRoles([]));

},[]);


const sendRequest = async()=>{

// 🔒 RBAC check here instead of blocking whole page
if(!perms.includes('REQUEST_ACCESS')){
 alert('Access Denied');
 return;
}

if(!role_id){
 alert('Select Role');
 return;
}

if(!justification){
 alert('Enter justification');
 return;
}

try{

 setLoading(true);

 await api.post('/access-request',{
   requested_role_id: role_id,
   justification
 });

 alert('Request Sent Successfully');

 setRole('');
 setJustification('');

}catch(err){

 console.log(err.response?.data || err.message);
 alert('Failed to send request');

}finally{
 setLoading(false);
}

};


return(

<div className='layout'>

<Sidebar/>

<div className='main'>

<div className='formBox'>

<h2>Request Access</h2>

{/* ✅ Show warning instead of blocking UI */}
{!perms.includes('REQUEST_ACCESS') && (
<p style={{color:'red'}}>
You do not have permission to request access
</p>
)}

<label>Select Role</label>
<select
value={role_id}
onChange={e=>setRole(e.target.value)}
>
<option value=''>Select Role</option>

{roles.map(r=>(
<option key={r.role_id} value={r.role_id}>
{r.role_name}
</option>
))}

</select>

<br/><br/>

<label>Justification</label>
<textarea
placeholder='Why do you need this role?'
value={justification}
onChange={e=>setJustification(e.target.value)}
/>

<br/><br/>

<button onClick={sendRequest} disabled={loading}>
{loading ? 'Sending...' : 'Send Request'}
</button>

</div>

</div>

</div>

)

}

