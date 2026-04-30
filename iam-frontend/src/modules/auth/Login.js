import {useState} from 'react';
import api from '../../services/api';
import {useNavigate,Link} from 'react-router-dom';

export default function Login(){

const[email,setEmail]=useState('');
const[password,setPassword]=useState('');
const[loading,setLoading]=useState(false);

const nav=useNavigate();

const login=async()=>{

if(!email || !password){
alert('Enter Email and Password');
return;
}

try{

setLoading(true);

const r = await api.post('/auth/login',{email,password});

// ✅ store token
localStorage.setItem('token', r.data.token);

// ✅ store user
localStorage.setItem('user', JSON.stringify(r.data.user));

// ✅ EXTRACT PERMISSIONS FROM TOKEN (FIXED)
const payload = JSON.parse(
 atob(r.data.token.split('.')[1])
);

localStorage.setItem(
 'permissions',
 JSON.stringify(payload.permissions || [])
);

// optional
localStorage.setItem('loginTime', new Date().toLocaleString());

alert('Login Successful');

nav('/dashboard');

}catch(e){

alert('Login Failed');

}finally{
setLoading(false);
}

}

return(

<div className="authBox">

<h2>SecureAccess IAM Login</h2>

<div className="formGroup">
<label>Email</label>
<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>
</div>

<div className="formGroup">
<label>Password</label>
<input
type="password"
placeholder="Enter Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>
</div>

<button onClick={login} disabled={loading}>
{loading ? 'Logging in...' : 'Login'}
</button>

<div className="loginLink">
New User?
<br/>
<Link to="/register">
Register Here
</Link>
</div>

</div>

)
}

