import React,{useState,useEffect}  from "react"
import {Avatar,TextField,Button,Grid,IconButton,FormControl,InputLabel,Select,MenuItem,Switch} from "@mui/material"
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getData } from "../services/ServerServices";

import {useStyles} from './BannerPicturesCss' 
import { posttData } from "../services/ServerServices";
import Swal from "sweetalert2";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";
import { DropzoneArea } from 'material-ui-dropzone';


export default function ProductList(props)
{    
   
    var classes=useStyles()
    const navigate = useNavigate()

    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[companyId,setCompanyId] = useState(admin.companyid)


    const [productLogos,setProductLogos]=useState({fileName:'/assets/watermark.png',bytes:''})

    const [images, setImages] = useState([])
    const [error,setError] = useState({})
    

    const handleImages=(files)=>{
      //setProductLogos({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
      setImages(files)
    }

  

    const clearValue=()=> 
{
 

  setProductLogos({fileName:'/assets/watermark.png',bytes:''})

}


  


   
  



    const handleSubmit = async() =>{
      if (validation()) {
    
      var formData = new FormData()
      formData.append('companyid',companyId)
 
     // formData.append('images',productLogos.bytes)
     
      images.map((item,i)=>{
         formData.append('picture'+i,item)
      })
      formData.append('status','true')
      var result =await posttData('company/banner_picture',formData)
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
    
      

       return isValid
    }

   


    return(
        <div className={classes.mainContainer} >
          <div className={classes.box}>
            <Grid container spacing={2}>
            <Grid item xs={12}  className={classes.rowStyle} >
            <div style={{display:'flex',flecDirection:'row'}}>
                <div><img src="/assets/logo.png" alt="Company logo" width="40"/></div>
              <div className={classes.headingStyle}>
             Banner Pictures
              </div>
                </div>
                <div>
                  <FormatListBulletedIcon onClick={()=>navigate('#')}/>
                </div>
             </Grid> 
               
                <Grid item xs={12}>
                <TextField fullWidth  value={companyId} onChange={(e)=>{setCompanyId(e.target.value)}}  label="Company Id" variant="outlined"/>
                </Grid>
             
             
  
          
               

                {/* <Grid item xs={6} className={classes.rowStyleUpload}>
                <IconButton fullWidth color="primary" aria-label="upload image" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleImages} required />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Icon"
                 variant="rounded"
                 src={productLogos.fileName}
                 sx={{ width: 56, height: 56 }}
                 />
                </Grid> */}
                <Grid item xs={12}>

                <DropzoneArea
  acceptedFiles={['image/*']}
  dropzoneText={"Drag and drop an image here or click"}
  filesLimit={10}
  onChange={(files) => handleImages(files)}
/>
                </Grid>

                
               <Grid item xs={6}>
                  <Button fullWidth onClick={handleSubmit}  variant="contained"> Submit</Button>
               </Grid>
              
               <Grid item xs={6}>
                  <Button onClick={clearValue} fullWidth variant="contained"> Reset</Button>
               </Grid>

            </Grid>
            </div>
        </div>
    )

}
