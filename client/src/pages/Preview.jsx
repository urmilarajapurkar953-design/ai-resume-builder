import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import ResumePreview from '../components/ResumePreview';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';
import api from '../config/api';

const Preview = () => {
  const {resumeId} = useParams();

  const [isloading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
 
  const loadResume = async () => {
    try {
      const {data} = await api.get('/api/resumes/public/' + resumeId);
      setResumeData(data.resume);
    } catch (error) {
      console.error('Error loading resume:', error);
    } finally {
      setIsLoading(false);
    }
  }
useEffect(() => {
  loadResume();
}, [resumeId])

  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-4 bg-white' />
      </div> 
    </div>
  ) : (
    <div>
      {isloading ? <Loader /> : (
       <div className='flex flex-col items-center justify-center h-screen bg-slate-50 px-4'>
  
  

  {/* Title */}
  <h1 className='text-2xl sm:text-3xl font-semibold text-slate-700 mb-2 text-center'>
    Resume not found
  </h1>

  {/* Subtitle */}
  <p className='text-sm text-slate-500 text-center max-w-md'>
    The resume you are looking for might have been deleted or the link is incorrect.
  </p>

  {/* Button */}
  <a
    href="/"
    className='mt-6 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200'
  >
    <ArrowLeft className='size-4' />
    Go to Dashboard
  </a>

</div>
      )}
    </div>
  )
}

export default Preview