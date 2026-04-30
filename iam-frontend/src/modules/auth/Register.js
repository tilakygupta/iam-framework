import {useState} from 'react';
import api from '../../services/api';
import {useNavigate,Link} from 'react-router-dom';

export default function Register(){

const navigate=useNavigate();

const[first_name,setFirst]=useState('');
const[middle_name,setMiddle]=useState('');
const[last_name,setLast]=useState('');
const[email,setEmail]=useState('');
const[phone,setPhone]=useState('');
const[password,setPassword]=useState('');

const save=async()=>{

if(!first_name || !email || !password){
alert('Please fill required fields');
return;
}

try{

await api.post('/auth/register',{
first_name,
middle_name,
last_name,
email,
phone,
password
});

alert('Registration Successful');

navigate('/');

}catch(err){

alert('Registration Failed');

}

}

return(

<div className="authBox">


<h2>User Registration</h2>

<div className="formGroup">
<label>First Name *</label>
<input
type="text"
placeholder="Enter First Name"
value={first_name}
onChange={(e)=>setFirst(e.target.value)}
/>
</div>

<div className="formGroup">
<label>Middle Name</label>
<input
type="text"
placeholder="Enter Middle Name"
value={middle_name}
onChange={(e)=>setMiddle(e.target.value)}
/>
</div>

<div className="formGroup">
<label>Last Name</label>
<input
type="text"
placeholder="Enter Last Name"
value={last_name}
onChange={(e)=>setLast(e.target.value)}
/>
</div>

<div className="formGroup">
<label>Email *</label>
<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>
</div>

<div className="formGroup">
<label>Phone</label>
<input
type="text"
placeholder="Enter Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>
</div>

<div className="formGroup">
<label>Password *</label>
<input
type="password"
placeholder="Enter Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>
</div>

<button onClick={save}>
Register
</button>

<div className="loginLink">
Already Registered?
<br/>
<Link to="/">Go To Login</Link>
</div>



</div>

)

}

