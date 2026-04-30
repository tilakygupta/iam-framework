import Sidebar from '../../components/Sidebar';
import {useEffect,useState} from 'react';
import api from '../../services/api';

export default function AuditLogMaster(){
const[logs,setLogs]=useState([])

useEffect(()=>{
api.get('/audit-logs').then(r=>setLogs(r.data))
},[])

return(
<div className='layout'>
<Sidebar/>
<div className='main'>
<h2>Audit Logs</h2>
<table border='1' cellPadding='10'>
<tr><th>ID</th><th>Activity</th></tr>
{logs.map(x=>(
<tr key={x.audit_id}>
<td>{x.audit_id}</td>
<td>{x.activity_type}</td>
</tr>
))}
</table>
</div>
</div>
)
}