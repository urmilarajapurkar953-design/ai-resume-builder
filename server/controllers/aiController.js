import Resume from "../models/Resume.js";
import ai from "../config/ai.js";

//Controller for enhancing resume professional summary using AI
//POST: /api/ai/enhance-pro-summary 


export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const {userContent} = req.body;

        if (!userContent) {
            return res.status(400).json({message: 'User content is required'});
        }
        
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL_NAME,
            messages: [
                { role: "system", content: "you are a expert in resume writing. Your task is to enhance the professional summary provided by the user. The summary should be 1-2 sentences also highlighting key skills and experiences, and career objectives.Make it more compelling and ATS-friendly. and only return text no options or anything else" },
                {
                    role: "user",
                    content: userContent,
                }
            ]
        });

        const enhancedContent = response.choices[0].message.content.trim();
        res.status(200).json({ message: 'Professional summary enhanced successfully', enhancedContent });

    } catch (error) {
       return res.status(400).json({message: 'Error occurred while enhancing professional summary'});  
    }
}

//Controller for enhancing resume job description using AI
//POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const {userContent} = req.body;

        if (!userContent) {
            return res.status(400).json({message: 'User content is required'});
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL_NAME,
            messages: [
                { role: "system", 
                    content: "you are a expert in resume writing. Your task is to enhance the job description provided by the user. The description should be 1-2 sentences also highlighting key responsibilities and achievements. use action verbs and quantify achievements where possible. Make it ATS-friendly. and only return text no options or anything else" },
                {
                    role: "user",
                    content: userContent,
                }
            ]
        });

        const enhancedContent = response.choices[0].message.content.trim();
        res.status(200).json({ message: 'Job description enhanced successfully', enhancedContent });

    } catch (error) {
       return res.status(400).json({message: 'Error occurred while enhancing job description'});  
    }
}

//Controller for uploading a resume to the database
//POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const {resumeText, title} = req.body;
        const userId = req.userId;
        if (!resumeText ){
            return res.status(400).json({message: 'Resume text is required'});
        }

        const systemPrompt = "you are an expert AI Agent to extract data from resume."
        const userPrompt = `
Extract data from this resume: ${resumeText}

Return ONLY valid JSON (no explanation).

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field_of_study": "",
      "graduation_year": "",
      "gpa": ""
    }
  ]
}
`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL_NAME,
            messages: [
                { role: "system", 
                    content: systemPrompt },
                    {
                    role: "user",
                    content: userPrompt,
                    }
            ],
            response_format: {
                type: "json_object",
            }
        })

        const extractedData = response.choices[0].message.content;

        console.log("RAW AI RESPONSE:", extractedData);

let parsedData;

try {
  parsedData = JSON.parse(extractedData);
} catch (err) {
  console.log("❌ JSON PARSE ERROR:", extractedData);
  return res.status(400).json({
    message: "AI returned invalid JSON"
  });
}
        const newResume = await Resume.create({
            userId,
            title, ...parsedData
        })
res.json({ resumeId: newResume._id });    } 
   catch (error) {
  console.log("❌ AI ERROR:", error);
  return res.status(400).json({
    message: error.message || "Error occurred while uploading resume"
  });
}
}