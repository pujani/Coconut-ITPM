import React,{useState} from 'react'
import axios from 'axios';
import Layout from '../components/Layout';
import Layoutt from '../components/Layoutt';

const Addnote = () => {

    const [note,setnote] = useState({
        NName:"",
        NNote:""
    });

    const [image,setimage] = useState(null);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setnote({
            ...note,
            [name]: value
        })
    };

    const handleImageChange = (e) => {
        setimage(e.target.files[0]);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("NName", note.NName);
        formdata.append("NNote", note.NNote);
        formdata.append("image", image);

        try{
            await axios.post("http://localhost:5001/api/note/addnote", formdata);
            alert("note added successfully");

            setnote({
                NName: "",
                NNote: ""
            })
            setimage(null);
        }catch(e){
            alert("note added failed");
        }
        
    }

  return (
    <div className="bg-white h-screen overflow-y-auto">
    <Layoutt>
<Layout>

<div className="flex min-h-screen items-center justify-center">
    <div className="w-full max-w-md p-6 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-bold">Add product</h2>
      <form onSubmit={handleSubmit}>
        <div>
            <label className="block text-sm font-medium text-gray-700">Tittle</label>
            <input type='text' name='NName' value={note.NName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-green-50" placeholder='Enter the tittle' required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <input type='text' name='NNote' value={note.NNote} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-green-50" placeholder='Enter the note' required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input type='file' accept='NImage/*' onChange={handleImageChange} className="w-full mt-1 p-2 border rounded-md bg-green-50" required />
        </div>
        <div>
            <button type='submit' className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md mt-4">Submit</button>
        </div>

      </form>
      </div>
      
               </div>
                      
                    </Layout>
                    </Layoutt>
                  </div>
    
  )
}

export default Addnote
