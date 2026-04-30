import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './modules/auth/Login';
import Register from './modules/auth/Register';
import Dashboard from './components/Dashboard';
import UserMaster from './modules/users/UserMaster';
import RoleMaster from './modules/roles/RoleMaster';
import PermissionMaster from './modules/permissions/PermissionMaster';
import UserRoleMapping from './modules/mapping/UserRoleMapping';
import RolePermissionMapping from './modules/mapping/RolePermissionMapping';
import AuditLogMaster from './modules/audit/AuditLogMaster';
import AccessRequest from './modules/accessRequests/AccessRequests';
import AccessApproval from './modules/accessRequests/AccessApproval';
import './App.css'

export default function App(){
return(
<BrowserRouter>
<Routes>
<Route path='/' element={<Login/>}/>
<Route path='/register' element={<Register/>}/>
<Route path='/dashboard' element={<Dashboard/>}/>
<Route path='/users' element={<UserMaster/>}/>
<Route path='/roles' element={<RoleMaster/>}/>
<Route path='/permissions' element={<PermissionMaster/>}/>
<Route path='/user-role-map' element={<UserRoleMapping/>}/>
<Route path='/role-permission-map' element={<RolePermissionMapping/>}/>
<Route path='/audit-logs' element={<AuditLogMaster/>}/>
<Route path="/access-request" element={<AccessRequest/>}/>
<Route path="/access-approval" element={<AccessApproval/>}/>
</Routes>
</BrowserRouter>
)}