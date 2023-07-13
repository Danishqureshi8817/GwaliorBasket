import React,{useState,}  from "react"
import {Avatar,TextField,Button,Grid,IconButton } from "@mui/material"
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import {useStyles} from './CategoryCss' 
import { posttData } from "../services/ServerServices";
import Swal from "sweetalert2";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";


export default function Category(props)
{  

  var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const [categoryName, setCategoryName] = useState('');
    const [companyId, setCompanyId] = useState(admin.companyid);
    const [description, setDescription] = useState('');
    const [categoryIcon,setCategoryIcon]=useState({fileName:'/assets/watermark.png',bytes:''})

    const [error,setError] = useState({})

   

    const navigate = useNavigate()

  var classes=useStyles()
 
const handleIcon=(event)=>{
    setCategoryIcon({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
}


const clearValue=()=>
{
    setCategoryName('')
  
    setDescription('')
    setCategoryIcon({fileName:'/assets/watermark.png',bytes:''})
}

const handleClick = async() =>{
  if (validation()) {
    var cd = new Date()
    var dd=cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
 
    var formData = new FormData()
    formData.append('companyid',companyId)
    formData.append('category',categoryName)
    formData.append('description',description)
    formData.append('icon',categoryIcon.bytes)
    formData.append('createdat',dd)
    formData.append('updateat',dd)
    formData.append('createdby','ADMIN')
    var result =await posttData('category/add_new_category',formData)
   /*alert(result.status)*/
   if(result.status)
   {
     Swal.fire({
       icon: 'success',
       title: result.message,
 
     })
   }
   else{
     Swal.fire({
       icon: 'error',
       title: result.message,
 
     })
   }
   clearValue();
 
  }
  }


  const handleError=(inputs,value)=>{
    setError( prev => ({...prev,[inputs]:value}))
   }


   const validation=()=>{
    var isValid=true
     if (!categoryName) {
      handleError("categoryName","Please Input Category Name")
      isValid=false 
     }
    
     if (!description) {
      handleError("description","Please Input Description")
      isValid=false 
     }
   
  
  
     return isValid
  }
    return(
        <div className={classes.mainContainer} >
          <div className={classes.box}>
            <Grid container spacing={2}>
            <Grid item xs={12}  className={classes.rowStyle} >
            <div style={{display:'flex',flecDirection:'row'}}>
                <div><img src="/assets/logo.png" alt="Category logo" width="40"/></div>
              <div className={classes.headingStyle}>
              Company Category 
              </div>
                </div>
                <div >
                  <FormatListBulletedIcon onClick={()=>navigate('/dashboard/displayallcategories')} />
                </div>
             </Grid> 
             <Grid item xs={6}>
                <TextField fullWidth  value={companyId} onChange={(event)=>setCompanyId(event.target.value)} label="Company Id" variant="outlined"/>
                </Grid>
                <Grid item xs={6} >
                <TextField fullWidth error={!error.categoryName?false:true} helperText={error.categoryName} onFocus={()=>{handleError("categoryName",null)}}  value={categoryName} onChange={(event)=>setCategoryName(event.target.value)} label="Category Name" variant="outlined"/>
                </Grid>
               
                <Grid item xs={12} >
                <TextField fullWidth error={!error.description?false:true} helperText={error.description} onFocus={()=>{handleError("description",null)}}  value={description} onChange={(event)=>setDescription(event.target.value)} label="Description" variant="outlined"/>
                </Grid>
               

                
               
                <Grid item xs={12} className={classes.rowStyleUpload}>
                <IconButton fullWidth color="primary" aria-label="upload picture" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleIcon} required />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Icon"
                 variant="rounded"
                 src={categoryIcon.fileName}
                 sx={{ width: 56, height: 56 }}
                 
                 />
                </Grid>
                
               <Grid item xs={6}>
                  <Button fullWidth onClick={handleClick}  variant="contained"> Submit</Button>
               </Grid>
              
               <Grid item xs={6}>
                  <Button onClick={clearValue} fullWidth variant="contained"> Reset</Button>
               </Grid>

            </Grid>
            </div>
        </div>
    )

}
