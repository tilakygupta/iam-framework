import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {

    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const [lastLogin, setLastLogin] = useState('');

    const [userCount, setUserCount] = useState(0);
    const [roleCount, setRoleCount] = useState(0);
    const [permCount, setPermCount] = useState(0);
    

    // ✅ get permissions
    const perms = JSON.parse(
        localStorage.getItem('permissions') || '[]'
    );

    useEffect(() => {

        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);

        if (u) {

            // ✅ USERS (only if allowed)
            if (perms.includes('VIEW_USER')) {
                api.get('/users')
                    .then(r => setUserCount(r.data.length))
                    .catch(() => setUserCount(0));
            }

            // ✅ ROLES (generally safe)
            api.get('/roles')
                .then(r => setRoleCount(r.data.length))
                .catch(() => setRoleCount(0));

            // ✅ PERMISSIONS (only if allowed)
            if (perms.includes('ASSIGN_PERMISSION')) {
                api.get('/permissions')
                    .then(r => setPermCount(r.data.length))
                    .catch(() => setPermCount(0));
            }

            // ✅ USER DETAILS
            api.get(`/users/${u.id}`)
                .then(res => {
                    setRole(res.data.role_name);
                    setLastLogin(res.data.last_login);
                })
                .catch(() => { });

        }

    }, []);

    return (

        <div className='layout'>

            <Sidebar />

            <div className='main'>

                <div className='topHeader'>

                    <div>
                        <h1>IAM Dashboard</h1>

                        <p>
                            Welcome, {user?.name || 'User'}
                        </p>

                        <p>
                            Current Role: {role || 'N/A'}
                        </p>

                    </div>

                    <div className='headerRight'>
                        <p>Last Login</p>
                        <p>{lastLogin || 'N/A'}</p>
                    </div>

                </div>


                <div className='cardBox'>

                    {/* USERS */}
                    {perms.includes('VIEW_USER') && (
                        <div className='card'>
                            <h3>Total Users</h3>
                            <h2>{userCount}</h2>
                        </div>
                    )}

                    {/* ROLES */}
                    <div className='card'>
                        <h3>Roles</h3>
                        <h2>{roleCount}</h2>
                    </div>

                    {/* PERMISSIONS */}
                    {perms.includes('ASSIGN_PERMISSION') && (
                        <div className='card'>
                            <h3>Permissions</h3>
                            <h2>{permCount}</h2>
                        </div>
                    )}

                    {/* SESSIONS */}
                    <div className='card'>
                        <h3>Active Sessions</h3>
                        <h2>1</h2>
                    </div>

                </div>

            </div>

        </div>

    )
}

