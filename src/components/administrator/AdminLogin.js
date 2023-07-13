
import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import { posttData } from '../services/ServerServices';
import { Navigate, useNavigate } from 'react-router-dom';

function AdminLogin() {

 const navigate = useNavigate()  
  const [emailAddress,setEmailAdress] = useState('')
  const [password, setPassword] = useState('')

  const handleClick = async()=>{
    var body={
        emailaddress:emailAddress,
        password:password
    }
    var result = await posttData('company/check_company_login',body)
    console.log("logoin",result.data)
     if(result.status){
      localStorage.setItem("ADMIN",JSON.stringify(result.data))
      localStorage.setItem("TOKEN",result.token)
      navigate("/dashboard")
     }
  }

  return (
    <MDBContainer fluid className="p-5 my-5 ">

      <MDBRow>

        <MDBCol style={{marginLeft:90}} col='8' md='6'  >
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone image" />
        </MDBCol>

        <MDBCol style={{marginRight:60}} col='4' md='3' className='my-5 mx-5 py-5'>


          <MDBInput wrapperClass='mb-4' value={emailAddress} onChange={(event)=>setEmailAdress(event.target.value)} label='Email address' id='formControlLg' type='email' size="lg"/>
          <MDBInput wrapperClass='mb-4' value={password} onChange={(event)=>setPassword(event.target.value)} label='Password' id='formControlLg' type='password' size="lg"/>


          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <MDBBtn className="mb-4 w-100" size="lg" onClick={()=>{handleClick()}}>Sign in</MDBBtn>

          <div className="divider d-flex align-items-center my-4">
            
          </div>

         

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default AdminLogin;

