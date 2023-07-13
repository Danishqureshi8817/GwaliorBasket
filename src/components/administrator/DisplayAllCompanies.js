import { useEffect,useState } from "react";
import MaterialTable from "@material-table/core";
import { getData,posttData } from "../services/ServerServices";
import { Avatar,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Switch,TextField,Grid,IconButton,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Swal from "sweetalert2";
import { ServerURL } from "../services/ServerServices";
import {useStyles} from './DisplayAllCompaniesCss' 
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

export default function DisplayAllCompanies(props)
{
 
 const navigate = useNavigate();

  const [state,setState]=useState('')
  const [city,setCity]=useState('')
  const [companyId,setCompanyId]=useState('')
  const [companyName,setCompanyName]=useState('')
  const [ownerName,setOwnerName]=useState('')
  const [emailAddress,setEmailAddress]=useState('')
  const [mobileNumber,setMobileNumber]=useState('')
  const [address,setAddress]=useState('')
  const [status,setStatus]=useState('')
  const[states,setStates] = useState([])
  const[cities,setCities] = useState([])
  const[btnStatus,setBtnStatus] = useState(false)
  const[oldPicture,setOldPicture] = useState('')
  const[message,setMessage] = useState('')

  const [companyLogo,setCompanyLogo]=useState({fileName:'/assets/watermark.png',bytes:''})

  var classes = useStyles()

  const fetchAllStates = async()=>{ 
    var result = await getData('statecity/fetch_all_states')
      setStates(result.data)
    /*alert(JSON.stringify(result))
     console.log("States",result)*/
  }
 
   useEffect(function(){
       fetchAllStates()
   },[])
 
    
   
 
 

   
 const handleImage=(event)=>{
   setCompanyLogo({fileName:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
   setBtnStatus(true)
  }
 
 const fatch_all_cities=async(stateid)=>{
    var body = {'stateid':stateid}
    var result = await posttData('statecity/fetch_all_cities',body)
     setCities(result.data)
 
 }
 
 const fillCities=()=>{
   return cities.map((item)=>{
    return (<MenuItem value={item.cityid}>{item.cityname}</MenuItem>) 
   })
 }
 
 const handleStateOnchange=(e)=>{
  //  alert(e.target)
   //console.log('targeet',e.target)
    setState(e.target.value)
    fatch_all_cities(e.target.value) //--stateid
 }
 
 const handleCityOnchange=(e)=>{
   //alert(e.target.value)--stateid
    setCity(e.target.value)
    
 }
 

 
 
 const fillStates=()=>{
   return states.map((item)=>{
    return (<MenuItem value={item.stateid}>{item.statename}</MenuItem>) 
   })
 }

  const [open, setOpen] = useState(false);

  const handleCloseDialog=( )=>{
    setOpen(false)
  }

  const handleOpenDialog=(rowData )=>{
    fatch_all_cities(rowData.state)
    setCompanyId(rowData.companyid)
    setCompanyName(rowData.companyname)
   setOwnerName(rowData.ownername)
   setEmailAddress(rowData.emailaddress)
   setMobileNumber(rowData.mobilenumber)
   setAddress(rowData.address)
   setState(rowData.state)
   setCity(rowData.city)
   setStatus(rowData.status)
   setCompanyLogo({fileName:`${ServerURL}/images/${rowData.logo}`,bytes:''})
   setOldPicture(rowData.logo)
    setOpen(true)
  }

  const handleStatus=(temp)=>{
   if(temp==='Pending')
   {setStatus('Verified')}
   if(temp==='Verified')
   {setStatus('Pending')}
  }

  const handleEditData =async()=>{
    var cd = new Date()
   var dd=cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()

    var body ={
      'companyid':companyId,
      'companyname':companyName,
    'ownername':ownerName,
    'emailaddress':emailAddress,
    'mobilenumber':mobileNumber,
    'address':address,
    'state':state,
    'city':city,
    'updateat':dd,
    'createdby':'ADMIN',
    'status':status}
    var result =await posttData('company/edit_company_data',body)
    /*alert(result.status)*/
    if(result.status)
    { setOpen(false)
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
    fetchAllCompanies()
  }

 const handleCancel=()=>{
   setCompanyLogo({fileName:`${ServerURL}/images/${oldPicture}`,bytes:''})
   setOldPicture('')
   setBtnStatus(false)
   setMessage("")
  }
  
const handleDelete=async(rowData)=>{
  
  /*alert(result.status)*/
  Swal.fire({
    title: 'Do you want to delete company?',
    showDenyButton: true,
    denyButtonText: `Cancel`,
    confirmButtonText: 'Delete',
    
  }).then(async(result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var res = await posttData('company/delete_company_data',{companyid:rowData.companyid})
      if(res.status){
      Swal.fire('Deleted', '', 'Successfully')
      fetchAllCompanies()
      }
      else{
        Swal.fire({
          icon: 'error',
          title: result.message,
    
        })
      }

    } else if (result.isDenied) {
      Swal.fire('Delete Process Cancel', '', 'info')
    }
  })
  
}

  const handleSavePicture=async()=>{
    var formData = new FormData()
    formData.append('companyid',companyId)
    formData.append('logo',companyLogo.bytes)
    var result = await posttData('company/edit_company_logo',formData)
    if(result.status)
    { 
     setMessage("assets/greentick.gif")
    }
    else{
      setMessage(result.message)
    }
    fetchAllCompanies()
    setBtnStatus(false)
  }

  const PictureButton=()=>{
    return(<div>
      {btnStatus? <div style={{display:'flex',padding:10}}>
       <Button onClick={handleCancel}>Cancel</Button>
       <Button onClick={handleSavePicture}>Save</Button>
      </div>:<div style={{fontSize:10,color:'green',fontWeight:'bold'}}><img src={`${message}`} width="90"/></div>}
    </div>

     
    )
  }


  const showCompanyDetails=()=>{


    return (
      <div>
        <Dialog
          open={open}
          //onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{display:'flex',justifyContent:'space-between'}}>
           <div style={{display:'flex',alignItems:'center'}}>
           <img src="/assets/logo.png" alt="Company logo" width="40"/>
            Edit Company
           </div>
            <div>
            <CloseIcon style={{cursor:'pointer'}} onClick={handleCloseDialog}/>
            </div>
           
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                       
            <Grid container spacing={2} style={{marginTop:5}}>

                <Grid item xs={6} >
                <TextField fullWidth value={companyName} onChange={(event)=>setCompanyName(event.target.value)} label="Company Name" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth value={ownerName} onChange={(event)=>setOwnerName(event.target.value)} label="Owner Name" variant="outlined"/>
                </Grid>

                <Grid item xs={6} >
                <TextField  fullWidth value={emailAddress} onChange={(event)=>setEmailAddress(event.target.value)} label="Email Address" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                <TextField fullWidth value={mobileNumber} onChange={(event)=>setMobileNumber(event.target.value)} label="Mobile Number" variant="outlined"/>
                </Grid>

                <Grid item xs={12} >
                <TextField fullWidth value={address} onChange={(event)=>setAddress(event.target.value)} label="Address" variant="outlined"/>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">State</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   onChange={handleStateOnchange}
                   value={state}
                   label="State"
                  // onChange={handleChange}
                    >
                   <MenuItem value={'Choose State'}>Choose State...</MenuItem>
                     {fillStates()}
                   </Select>
                 </FormControl>
                </Grid>
                <Grid item xs={6}>
                 <FormControl fullWidth>
                   <InputLabel id="demo-simple-select-label">City</InputLabel>
                   <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   onChange={handleCityOnchange}
                   value={city}
                   label="City"
                  // onChange={handleChange}
                    >
                   <MenuItem value={'Choose City'}>Choose City...</MenuItem>
                     {fillCities()}
                   </Select>
                 </FormControl>
                </Grid>

                <Grid item xs={6} >
                {status==="Pending"? <Switch onChange={()=>{handleStatus(status)}} />:<Switch onChange={()=>{handleStatus(status)}}  defaultChecked/>}
                {status}
                </Grid>

                <Grid item xs={6} className={classes.rowStyle}>
                <IconButton fullWidth color="primary" aria-label="upload picture" component="label">
                 <input hidden accept="image/*" type="file" onChange={handleImage} />
                <PhotoCamera />
                </IconButton>

                <Avatar
                 alt="Remy Sharp"
                 variant="rounded"
                 src={companyLogo.fileName}
                 sx={{ width: 56, height: 56 }}
                 />
                 <PictureButton/>
                </Grid>
                
               
            </Grid>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditData} >Edit</Button>
            <Button  onClick={handleCloseDialog}>
            Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  const [companies,setCompanies] = useState([])
   

  const fetchAllCompanies=async()=>{
     
    var result=await getData('company/fetch_all_company')
    //alert(JSON.stringify(result.data))
     setCompanies(result.data)
  }

  useEffect(function(){
     fetchAllCompanies()
  },[])


    function showAllCompany() {
        return (
          <MaterialTable
            title={<span className={classes.headingStyle}>Company Details</span>}
            columns={[
              { title: 'Company Name', field: 'companyname' },
              { title: 'Owner Name', field: 'ownername' },
              { title: 'Address', field: 'cityname',
              render:rowData=><div>{rowData.address}<br/>{rowData.cityname}<br/>{rowData.statename}</div>
            },{ title: 'Contact Details',
              render:rowData=><div>{rowData.emailaddress}<br/>{rowData.mobilenumber}</div>
            },
            { title: 'Status', field: 'status' },
            { title: 'Last Updation',
              render:rowData=><div>{rowData.createdat}<br/>{rowData.updateat}<br/>{rowData.createdby}</div>
            },
            { title: 'Logo',
              render:rowData=><Avatar src={`${ServerURL}/images/${rowData.logo}`} style={{width:70,height:70}} variant="rounded" />
            },
            ]}
            data={ companies }        
            actions={[
                 {
                  icon:'add',
                  isFreeAction:true,
                  tooltip:'Add Company',
                  onClick:()=>navigate('/company')
                 },

              {
                icon: 'edit',
                tooltip: 'EditUser',
                onClick: (event, rowData) => handleOpenDialog(rowData )
              },
              {
                icon: 'delete',
                tooltip: 'Delete User',
                onClick: (event, rowData) => handleDelete(rowData )
              }
            ]}
          />
        )
      }

return(

    <div className={classes.mainContainer}>
     <div className={classes.box}>
        {showAllCompany()}
        {showCompanyDetails()}
     </div>
    </div>
)


}