import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'


const ResumePreview = ({data, template, accentColor, classes = ""}) => {

    const renderTemplate = ()=>{
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
                 case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;
                 case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
                
        
            default:

                return <ClassicTemplate data={data} accentColor={accentColor}/>;
        }
    }
  return (
    <div className='w-full bg-green-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes }>
            {renderTemplate()}

        </div>
        <style >
            {`
            @page {
  size: letter;
  margin: 0;
}

@media print {
  html, body {
    width: 8.5in;
    height: auto;
    overflow: visible;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

 @media print {
  body {
    margin: 0;
  }
}


  #resume-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none !important;
    border: none !important;
  }
}
            `}
        </style>
    </div>
  )
}

export default ResumePreview