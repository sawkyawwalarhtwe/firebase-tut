import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import {db} from './firebase-config';
import {addDoc, collection, doc, getDocs} from 'firebase/firestore';
import { Outlet, Link } from "react-router-dom";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function NewInvoice() {
  const [items,setItems] = useState([]);
  const [totalNumber,setTotalNumber] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [tax,setTax] = useState(0.0);
  const [invoice,setInvoice]= useState('');
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('mx-24 w-[30%] hidden')
  const [inputFields, setInputFields] = useState([
    { ItemName: '', Number:0, Price:0 }
  ])
  const itemsCollectionRef = collection(db, 'items');
  const invoiceCollectionRef = collection(db,'invoice');

  useEffect(()=>{

    const getItems = async ()=>{
      const data = await getDocs(itemsCollectionRef);
      const invoiceData = await getDocs(invoiceCollectionRef);
      setInvoices(invoiceData.docs.map((doc)=>({...doc.data(),id: doc.id})))
      setItems(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
      
    }

    getItems();
    console.log(items);
  }, [])

  const addFields = () => {
    let newField = { ItemName: '', Number:0, Price:0 }
    console.log("new field has been called");

    setInputFields([...inputFields, newField])
}

const removeFields = (index) => {
  console.log("remove");
  let data = [...inputFields];
  data.splice(index, 1);
  console.log(data);
  setInputFields(data);
 
}

const formFieldHandler = (name,index,value)=>{
  let data = [...inputFields];
  if(name==="Name")
  data[index].ItemName = value;
  else if(name==="Number"){
    data[index].Number = value;
  }
  
  else if(name==="Price")
  data[index].Price = value
  let totalNum = 0;
  let subTot = 0;
  data.map((input)=>{
    
    subTot =parseInt(subTot)+parseInt(input.Number*input.Price);
  })

  data.map((input)=>{
    
    totalNum =parseInt(totalNum)+parseInt(input.Number);
  })

  setSubTotal(subTot);
  setTotalNumber(totalNum);
  setInputFields(data);

}

const createInvoice = async()=>{
  let data = {
    invoice: invoice,
    tax: tax,
    invoiceDetails: inputFields
  }
  await addDoc(invoiceCollectionRef, data);
 setInputFields([
  { ItemName: '', Number:0, Price:0 }
])
setSubTotal(0);
  setTotalNumber(0);
  setInvoice("");
  setTax(0);
}

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}  >
        <div onClick={()=>{console.log('hello'); setSearch("mx-24 w-[30%] flex  my-2")}}
            >
        <Toolbar sx={{mx:8}}>
          <Search >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                 onClick={()=>{console.log('hello'); setSearch("mx-24 w-[30%] flex  my-2")}}
                
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
        
        <Paper id="item-list" className={search} elevation={3}>
      <ol className='p-2 w-[100%]'>
      
        {invoices.map((item)=>{
          return(
            <Link to={{
                pathname:"/update",
                search: item.id,
                state: "hello from new",
            }} ><li className='text-sm cursor-pointer border rounded my-1 px-2 py-1'>{item.invoice}</li></Link>
            
          )
        })}
      </ol>
    </Paper>
    </div>
        <TableContainer component={Paper} sx={{fontSize: 10, width:'80%',mb:2, mx:12}}>
      <Table aria-label="simple table" onClick={()=>{setSearch("mx-24 w-[30%] hidden my-2")}}>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontSize: 10,}}>Item Name</TableCell>
            <TableCell sx={{fontSize: 10,}} align="right">Item</TableCell>
            <TableCell sx={{fontSize: 10,}} align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{fontSize: 10,}} component="th" scope="row">
                {item.Name}
              </TableCell>
              <TableCell sx={{fontSize: 10,}} align="right">{item.ItemName}</TableCell>
              <TableCell sx={{fontSize: 10,}} align="right">{item.Amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div onClick={()=>{setSearch("mx-24 w-[30%] hidden my-2")}}>
    <Typography sx={{mx:12, }}>New Invoice</Typography>
      <div className='flex mx-24'>
      <h1 className='my-2 mr-2 text-sm'>Invoice Number</h1>
      <input type="text" name="invoice" value={invoice} onChange={(e)=>{
          setInvoice(e.target.value);
      }} className="w-[100px] mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300
       placeholder-slate-400 focus:outline-none
       focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" />
      </div>
      <table className="table-auto mx-24">
  <thead>
    <tr>
      <th className='mx-2'>Item Name</th>
      <th className='mx-2'>{isNaN(totalNumber)?0:totalNumber} of items</th>
      <th className='mx-2'>Price</th>
      <th className='mx-2'>Total</th>
      <th>          </th>
    </tr>
  </thead>
  <tbody>
    {inputFields.map((input,index)=>{
      return(
        <tr key={index}>
      <td><input type="text" name="Name" value={input.ItemName} onChange={(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        console.log(name,value)
        formFieldHandler(name,index,value)}} className=" text-right w-[200px] mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300
       placeholder-slate-400 focus:outline-none
       focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" /></td>
      
      <td><input  type="text" name="Number" value={input.Number} onChange={(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        console.log(name,value)
        formFieldHandler(name,index,value)}} className="text-right w-[200px] mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300
       placeholder-slate-400 focus:outline-none
       focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" /></td>
      
      <td><input  type="text" name="Price" value={input.Price} onChange={(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        console.log(name,value)
        formFieldHandler(name,index,value)}} className="w-[200px] text-right mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300
       placeholder-slate-400 focus:outline-none
       focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" /></td>
      <td>
      <input  type="text" name="Price" value={input.Price*input.Number} className="w-[200px] text-right mt-1 px-3 py-2 bg-white  border-slate-300
       placeholder-slate-400 focus:outline-none
       focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" />
      </td>
      <td><IconButton color="primary" aria-label="upload picture" component="label" >
          <input hidden onClick={() => removeFields(index)} />
          <ClearIcon />
          </IconButton>
        </td>
    </tr>
      )
    })}
    
  </tbody>
</table>
<div className='text-sm mx-24 my-8 flex'>
  <div className="flex-1 w-[200px]">
    <Button size="small" variant='contained' onClick={()=>{
        addFields();
      }}>Add More</Button></div>

<div className=''>
  <div className='flex'>
  <h1 className='w-24 my-2'>Sub Total</h1>
  <input type="text" value={subTotal} disabled class="mt-1 block w-full px-3 py-2 bg-white "/>
  </div>
  
  <div className='flex'>
  <h1 className='w-24 my-2'>Tax</h1>
  <input type="text" value={tax} onChange={(e)=>{
    setTax(e.target.value);
  }}  class="mt-1 block w-full px-3 py-2 bg-white "/>
  </div>

  <div className='flex'>
  <h1 className='w-24 my-2'>Total</h1>
  <input type="text" value={subTotal+(subTotal*tax)} disabled class="mt-1 block w-full px-3 py-2 bg-white "/>
  </div>

</div>

</div>
<div className='mx-24'>
<Button  size="small" variant='contained' onClick={()=>{
        createInvoice();
      }}>Create</Button>
</div>
</div>
    </Box>
      
    </div>
  );
}

export default NewInvoice;
