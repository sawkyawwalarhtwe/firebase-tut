import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import {db} from './firebase-config';
import {addDoc, collection, doc, getDocs, updateDoc} from 'firebase/firestore';
import { useLocation } from "react-router-dom"


function UpdateInvoice() {
  const [items,setItems] = useState([]);
  const [totalNumber,setTotalNumber] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [tax,setTax] = useState(0.0);
  const [invoice,setInvoice]= useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [inputFields, setInputFields] = useState([
    { ItemName: '', Number:0, Price:0 }
  ])
  let location = useLocation();
  const itemsCollectionRef = collection(db, 'items');
  const invoiceCollectionRef = collection(db,'invoice');
  console.log(location.search.replace("?",""));
  useEffect(()=>{
    let invoices = []
    const getItems = async ()=>{
      const data = await getDocs(itemsCollectionRef);
      const invoiceData = await getDocs(invoiceCollectionRef);
    invoices = invoiceData.docs.map((doc)=>({...doc.data(), id: doc.id}))
    invoices.map((item)=>{
        if(item.id == location.search.replace("?","")){
            setInvoice(item.invoice);
            setInputFields(item.invoiceDetails)
            setSubTotal(item.subTot)
            setTax(item.tax)
            setTotalAmount(item.totalAmount);
        }
            

    })
    console.log(items)
    }

    getItems();
    console.log(invoices);
    
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
  setTotalAmount(subTotal+(subTotal*tax));

}

const updateInvoice = async()=>{
  let data = {
    invoice: invoice,
    tax: tax,
    invoiceDetails: inputFields,
    totalAmount: totalAmount
  }
  const invoiceDoc = doc(db,"invoice", location.search.replace("?",""))
  await updateDoc(invoiceDoc,data)
  window.location.replace("/");
}

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }} className="my-4 ">
    <Typography sx={{mx:12, }}>Update Invoice</Typography>
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
  <input type="text" value={totalAmount} disabled class="mt-1 block w-full px-3 py-2 bg-white " maxLength={12}/>
  </div>

</div>

</div>
<div className='mx-24'>
<Button  size="small" variant='contained' onClick={()=>{
        updateInvoice();
      }}>Update</Button>
</div>

    </Box>
      
    </div>
  );
}

export default UpdateInvoice;
