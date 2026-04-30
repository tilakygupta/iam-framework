import {Link, useNavigate} from 'react-router-dom';

export default function Sidebar(){

const nav = useNavigate();

const perms = JSON.parse(
 localStorage.getItem('permissions') || '[]'
);

const logout = ()=>{
 localStorage.clear();
 nav('/');
};

// helper
const canAccess = (perm) => perms.includes(perm);

return(

<div className='sidebar'>

<h2>SecureAccess IAM</h2>

<Link to='/dashboard'>Dashboard</Link>

{/* Users */}
{canAccess('VIEW_USER')
 ? <Link to='/users'>Users</Link>
 : <span className='disabledLink'>Users</span>
}

{/* Roles */}
{canAccess('CREATE_ROLE')
 ? <Link to='/roles'>Roles</Link>
 : <span className='disabledLink'>Roles</span>
}

{/* Permissions */}
{canAccess('ASSIGN_PERMISSION')
 ? <Link to='/permissions'>Permissions</Link>
 : <span className='disabledLink'>Permissions</span>
}

{/* User Role Map */}
{canAccess('ASSIGN_ROLE')
 ? <Link to='/user-role-map'>User Role Map</Link>
 : <span className='disabledLink'>User Role Map</span>
}

{/* Role Permission Map */}
{canAccess('ASSIGN_PERMISSION')
 ? <Link to='/role-permission-map'>Role Permission Map</Link>
 : <span className='disabledLink'>Role Permission Map</span>
}

{/* Access Requests */}
{canAccess('REQUEST_ACCESS')
 ? <Link to='/access-request'>Access Requests</Link>
 : <span className='disabledLink'>Access Requests</span>
}

{/* Approval */}
{canAccess('APPROVE_ACCESS')
 ? <Link to='/access-approval'>Access Approval</Link>
 : <span className='disabledLink'>Access Approval</span>
}

{/* Audit */}
{canAccess('VIEW_AUDIT')
 ? <Link to='/audit-logs'>Audit Logs</Link>
 : <span className='disabledLink'>Audit Logs</span>
}

<button onClick={logout} className='logoutBtn'>
Logout
</button>

</div>

);
}

