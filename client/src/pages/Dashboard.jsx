import {
  FilePenLineIcon,
  Form,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../config/api";
import toast from "react-hot-toast";
import { extractTextFromPDF } from "../utils/pdfUtils";

const Dashboard = () => {

const { user, token } = useSelector(state => state.auth)


  // ✅ Use real colors (not Tailwind classes)
  const colors = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loadaAllResumes = async () => {
    try {
          const { data } = await api.get('/api/users/resumes', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const createResume = async (event) => {
   try {
    event.preventDefault();
    const {data} = await api.post('/api/resumes/create', {title}, {headers: {Authorization: token}})
    setAllResumes([...allResumes, data.resume])
    setTitle('')
    setShowCreateResume(false);
    navigate(`/app/builder/${data.resume._id}`)
   } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
    
   }
  }

const uploadResume = async (event) => {
  event.preventDefault();
  setIsLoading(true);

  try {
    console.log("STEP 1: Start");

    const resumeText = await extractTextFromPDF(resume);

    console.log("STEP 2: Extracted");
    console.log("TEXT LENGTH:", resumeText?.length);
    console.log("TEXT:", resumeText);

    if (!resumeText || resumeText.length < 20) {
      toast.error("PDF not readable. Try another file.");
      return;
    }

    const { data } = await api.post(
      '/api/ai/upload-resume',
      { title, resumeText },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("STEP 3: API SUCCESS");

    setTitle('');
    setResume(null);
    setShowUploadResume(false);
    navigate(`/app/builder/${data.resumeId}`);

  } catch (error) {
    console.log("❌ FULL ERROR:", error.response?.data || error.message);
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    setIsLoading(false);
  }
};

const editTitle = async (event) => {
  event.preventDefault();

  try {
    const { data } = await api.put(
      '/api/resumes/update',
      { resumeId: editResumeId, resumeData: { title }, }, 
      { headers: { Authorization: token } }
    );

    // update UI after backend success
    setAllResumes(prev =>
      prev.map(resume =>
        resume._id === editResumeId
          ? data.resume
          : resume
      )
    );

    setEditResumeId('');
    setTitle('');
    toast.success("Title updated");

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};
  const deleteResume = async (resumeId) => {
    try {
       const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
  if (confirmDelete) {
    const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: {Authorization: token}})
    setAllResumes(allResumes.filter(resume => resume._id !== resumeId));
    toast.success(data.message);
  }
      
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
      
    }
  };


  useEffect(() => {
    loadaAllResumes();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, John Doe!
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button onClick={()=> setShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button onClick={()=>setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="my-6 border-slate-300 sm:w-[305px]" />

        {/* Resume Cards */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const basecolor = colors[index % colors.length];

            return (
              <button
                key={index}
                onClick={()=> navigate(`/app/builder/${resume._id}`)}
                style={{
                  background: `linear-gradient(135deg, ${basecolor}20, ${basecolor}60)`,
                  borderColor: basecolor + "40",
                }}
                className="relative w-full h-48 sm:max-w-36 flex flex-col items-center rounded-lg justify-center gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: basecolor }}
                />

                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: basecolor }}
                >
                  {resume.title}
                </p>

                <p
                  className="absolute bottom-1 text-[11px] transition-all duration-300 px-2 text-center"
                  style={{ color: basecolor + "CC" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div onClick={e=> e.stopPropagation()} className="absolute top-1 right-1 group-hover:flex hidden items-center">
                  <TrashIcon onClick={()=>deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                  <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle (resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
        {showCreateResume && (
          <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center ">
            <div onClick={e => e.stopPropagation()} className="bg-slate-50 border shadow-md rounded-lg p-6 w-full max-w-sm relative">
              <h2 className="text-xl font-bold mb-4">Create a New Resume</h2>
              {/* Form fields for resume creation */}
              <input onChange={(e)=>setTitle(e.target.value)} value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="mb-4 p-2 border rounded w-full"
                required
              />
              <button
                type="submit"
                className="bg-green-600 w-full text-white py-2  rounded hover:bg-green-700 transition-colors"
              >
                <XIcon
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
                  onClick={() => {
                    setShowCreateResume(false);setTitle("");
                  }}
                />
                Create Resume
              </button>
            </div>
          </form>
        )}

        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center ">
            <div onClick={e => e.stopPropagation()} className="bg-slate-50 border shadow-md rounded-lg p-6 w-full max-w-sm relative">
              <h2 className="text-xl font-bold mb-4">Upload a existing Resume</h2>
              {/* Form fields for resume creation */}
              <input onChange={(e)=>setTitle(e.target.value)} value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="mb-4 p-2 border rounded w-full"
                required
              />
<div>
  <label htmlFor="resume-input" className="block text-sm text-slate-700">Select Resume File
    <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-dashed border-slate-400 rounded-md p-4 my-4 py-10 hover:border-green-500 hover:text-green-700 cursor-pointer transition-all ">
      {resume ? (
        <p className="text-sm text-green-700">{resume.name} </p>
      ) : (
        <>
          <UploadCloudIcon  className="size-14 stroke-1" />
          <p className="text-sm">upload your resume</p>
        </>
      )}
    </div>
  </label>
  <input
    id="resume-input"
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={(e) => setResume(e.target.files[0])}
    className="hidden"
  />
</div>

              <button disabled={isLoading} 
                type="submit"
                className="bg-green-600 w-full text-white py-2  rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >{isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white"
              />
              } 
              {isLoading? 'uploading...' : 'Upload Resume'}
                <XIcon
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
                  onClick={() => {
                    setShowUploadResume(false);setTitle("");
                  }}
                />
                Upload Resume
              </button>
            </div>
          </form>
          
        )}

        {editResumeId && (
          <form onSubmit={editTitle} onClick={()=> setEditResumeId(false)} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center ">
            <div onClick={e => e.stopPropagation()} className="bg-slate-50 border shadow-md rounded-lg p-6 w-full max-w-sm relative">
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              {/* Form fields for resume creation */}
              <input onChange={(e)=>setTitle(e.target.value)} value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="mb-4 p-2 border rounded w-full"
                required
              />
              <button
                type="submit"
                className="bg-green-600 w-full text-white py-2  rounded hover:bg-green-700 transition-colors"
              >
                <XIcon
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
                  onClick={() => {
                    setEditResumeId('');setTitle("");
                  }}
                />
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
