import React,{useState,useEffect}  from "react"
import {Avatar,TextField,Button,Grid,IconButton,FormControl,InputLabel,Select,MenuItem,FormLabel,RadioGroup,Radio,FormControlLabel } from "@mui/material"
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getData } from "../services/ServerServices";

import {useStyles} from './ProductsCss' 
import { posttData } from "../services/ServerServices";
import Swal from "sweetalert2";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";


export default function Product(props)
{    
   
    var classes=useStyles()
    const navigate = useNavigate()

    var admin = JSON.parse(localStorage.getItem('ADMIN'))

     const[companyId,setCompanyId] = useState(admin.companyid)
     const[categoryId,setCategoryId] = useState('Choose Category...')
     const[productName,setProductName] = useState('')
     const[description,setDescription] = useState('')
     const[status,setStatus] = useState('Choose Status...')
    const [trending,setTrending] = useState('')
    const[priceType,setPriceType] = useState('Choose Price Type...')
    const [deal,setDeal] = useState('')
    const[categoryIdS,setCategoryIdS] = useState([])
    const [productLogo,setProductLogo]=useState({fileName:'/assets/watermark.png',bytes:''})
    const [priceTypes, setPriceTypes] = useState([])
    
    const [error,setError] = useState({})
    

    const handleImage=(event)=>{
      setProductLogo({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
    }

    const clearValue=()=> 
{
 
  setCategoryId('Choose Category...')
  setProductName('')
  setDescription('')
  setStatus('Choose Status...')
  setTrending('')
  setPriceType('Choose Price Type...')
  setDeal('')
  setProductLogo({fileName:'/assets/watermark.png',bytes:''})

}


    const fetchAllCategory = async()=>{ 
      var result = await getData('category/fetch_all_category')
        setCategoryIdS(result.data)
      /*alert(JSON.stringify(result))
       console.log("States",result)*/
    }
   
    const fetchAllPriceType = async()=>{
      var result = await getData('product/fetch_all_pricetype')
      setPriceTypes(result.data)
     }
  

     useEffect(function(){
         fetchAllCategory()
         fetchAllPriceType()
        
     },[])
   
     const fillCategory=()=>{
      return categoryIdS.map((item)=>{
       return (<MenuItem value={item.categoryid}>{item.category}</MenuItem>) 
      })
    }
    
    const fillPriceType=()=>{
      return priceTypes.map((item)=>{
       return (<MenuItem value={item.pricetypeid}>{item.pricetype}</MenuItem>) 
      })
    }



    const handleSubmit = async() =>{
      if (validation()) {
      var cd = new Date()
      var dd=cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
   
      var formData = new FormData()
      formData.append('companyid',companyId)
      formData.append('categoryid',categoryId)
      formData.append('productname',productName)
      formData.append('description',description)
      formData.append('status',status)
      formData.append('trending',trending)
      formData.append('deals',deal)
      formData.append('pricetype',priceType)
     
      formData.append('image',productLogo.bytes)
      formData.append('createdat',dd)
      formData.append('updateat',dd)
      formData.append('createdby','ADMIN')
      
      var result =await posttData('product/add_new_product',formData)
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
    
       if (!categoryId || categoryId=="Choose Category...") {
        handleError("categoryId","Please Select Category")
        isValid=false 
       }
       if (!productName) {
        handleError("productName","Please Input Product Name")
        isValid=false 
       }
       if (!description) {
        handleError("description","Please Input Description")
        isValid=false 
       }
       if (!status || status=="Choose Status") {
        handleError("status","Please Select Status")
        isValid=false 
       }
       if (!trending) {
        handleError("trending","Please Select trending")
        isValid=false 
       }
       if (!deal) {
        handleError("deal","Please Select Deal")
        isValid=false 
       }
       if (!priceType || priceType=="Choose Price Type") {
        handleError("priceType","Please Select priceType")
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
                <div><img src="/assets/logo.png" alt="Company logo" width="40"/></div>
              <div className={classes.headingStyle}>
              Product Entry
              </div>
                </div>
                <div>
                  <FormatListBulletedIcon onClick={()=>navigate('/dashboard/displayallproducts')}/>
                </div>
             </Grid> 
               
                <Grid item xs={6}>
                <TextField fullWidth  value={companyId} onChange={(e)=>{setCompanyId(e.target.value)}}  label="Company Id" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Category Id</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   onChange={(e)=>{setCategoryId(e.target.value)}}
                   value={categoryId}
                   label="Category Id"
                   error={!error.categoryId?false:true}
                   onFocus={()=>handleError("categoryId",null)}
                  
                    >
                   <MenuItem value={'Choose Category...'}>Choose Category...</MenuItem>
                     {fillCategory()}
                   </Select>
                   <div style={{fontSize:10,color:'red',padding:5}}>{error.categoryId}</div>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth error={!error.productName?false:true} helperText={error.productName} onFocus={()=>{handleError("productName",null)}} value={productName} onChange={(e)=>{setProductName(e.target.value)}} label="Product Name" variant="outlined"/>
                </Grid>
                <Grid item xs={6} >
                <TextField fullWidth error={!error.description?false:true} helperText={error.description} onFocus={()=>{handleError("description",null)}} value={description} onChange={(e)=>{setDescription(e.target.value)}} label="Description" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Status</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                  
                   onChange={(e)=>{setStatus(e.target.value)}}
                   value={status}
                   label="Status"
                   error={!error.status?false:true}
                   onFocus={()=>handleError("status",null)}
                  // onChange={handleChange}
                    >
                   <MenuItem value={"Choose Status..."}>Choose Status...</MenuItem>
                   <MenuItem value={"Available"}>Available</MenuItem>
                   <MenuItem value={"Unavailable"}>Unavailable</MenuItem>
                     
                   </Select>
                   <div style={{fontSize:10,color:'red',padding:5}}>{error.status}</div>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Trending</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={trending}
        onChange={(e)=>{setTrending(e.target.value)}}
        error={!error.trending?false:true} 
        onFocus={()=>{handleError("trending",null)}}
      >
        <FormControlLabel  value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />}  label="No" />
        
      </RadioGroup>
      <div style={{fontSize:10,color:'red',padding:5}}>{error.trending}</div>
    </FormControl>
                </Grid>
                <Grid item xs={6}>
                
                <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Deals</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={deal}
        onChange={(e)=>{setDeal(e.target.value)}}
        error={!error.deal?false:true} 
        onFocus={()=>{handleError("deal",null)}}
      >
        <FormControlLabel  value={"yes"} control={<Radio />} label="Yes" />
        <FormControlLabel  value={"no"} control={<Radio />} label="No" />
       
      </RadioGroup>
      <div style={{fontSize:10,color:'red',padding:5}}>{error.deal}</div>
    </FormControl>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">Price Type</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                  
                   onChange={(e)=>{setPriceType(e.target.value)}}
                   value={priceType}
                   label="Price Type"
                   error={!error.priceType?false:true}
                   onFocus={()=>handleError("priceType",null)}
                  // onChange={handleChange}
                    >
                   <MenuItem value={"Choose Price Type..."}>Choose Price Type...</MenuItem>
                    {fillPriceType()}

                   </Select> 
                   <div style={{fontSize:10,color:'red',padding:5}}>{error.priceType}</div>
                 </FormControl>
                </Grid>

                <Grid item xs={12} className={classes.rowStyleUpload}>
                <IconButton fullWidth color="primary" aria-label="upload image" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleImage} required />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Icon"
                 variant="rounded"
                 src={productLogo.fileName}
                 sx={{ width: 56, height: 56 }}
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
