import React,{useState} from 'react'
import axios from 'axios';

const Adddisease = () => {

    const [disease,setdisease] = useState({
        DName: ""
    });

    const [image,setimage] = useState(null);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setdisease({
            ...disease,
            [name] : value
    })
    };

    const handleImageChange = (e) => {
      setimage(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("DName", disease.DName);
        formdata.append("image", image);

        try{
            await axios.post("http://localhost:5001/api/disease/adddisease", formdata);
            alert("disease added successfully");
            setdisease({
                DName: "" 
            })
            setimage(null)
        }catch(e){
            alert("disease added failed");
        }
    }


  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input type='text' name='DName' value={disease.DName} onChange={handleChange} placeholder='Enter the Disease' required />
      </div>
      <div>
        <label>Image</label>
        <input type='file' accept='DImage/*' onChange={handleImageChange} required />
      </div>
      <div>
        <button type='submit'> Submit </button>
      </div>
      </form>
    </div>
  )
}

export default Adddisease
