import React, { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resume = {} }, ref) => {
  const { 
    personalInfo = {}, 
    experience = [], 
    education = [], 
    skills = [], 
    projects = [], 
    languages = [] 
  } = resume;

  return (
    <div 
      ref={ref} 
      className="resume-container bg-white text-slate-900 p-12 shadow-2xl min-h-[1100px] w-[210mm] mx-auto text-[11pt]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header className="border-b-2 border-indigo-600 pb-6 mb-8 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-slate-900 mb-2">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.address && <span>• {personalInfo.address}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-indigo-600 text-sm mt-2 font-medium">
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          {personalInfo.website && <span>Website: {personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-indigo-600 border-b border-slate-200 mb-3 tracking-wide">Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-indigo-600 border-b border-slate-200 mb-4 tracking-wide">Work Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{exp.role || 'Position'}</h3>
                    <div className="text-indigo-600 font-semibold">{exp.company || 'Company Name'}</div>
                  </div>
                  <div className="text-right text-slate-500 font-medium">
                    <div>{exp.startDate} – {exp.endDate || 'Present'}</div>
                    <div className="text-xs">{exp.location}</div>
                  </div>
                </div>
                <div 
                  className="text-slate-700 mt-2 preview-content"
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-indigo-600 border-b border-slate-200 mb-4 tracking-wide">Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.institution || 'University Name'}</h3>
                  <div className="text-slate-700">{edu.degree} in {edu.field}</div>
                </div>
                <div className="text-right text-slate-500 font-medium whitespace-nowrap">
                  {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-indigo-600 border-b border-slate-200 mb-4 tracking-wide">Key Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900 text-base">{proj.title}</h3>
                  {proj.link && <span className="text-indigo-600 text-sm">{proj.link}</span>}
                </div>
                <p className="text-slate-700 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-indigo-600 border-b border-slate-200 mb-3 tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-sm font-medium border border-slate-200">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
      
      {/* Languages */}
      {languages && Array.isArray(languages) && languages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase text-indigo-600 border-b border-slate-200 mb-3 tracking-wide">Languages</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-slate-700 font-medium capitalize">{lang}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Print Specific Styles */}
      <style>{`
        @media print {
          @page { 
            margin: 0; 
            size: auto;
          }
          body { 
            margin: 0;
            -webkit-print-color-adjust: exact; 
          }
          .resume-container {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            padding: 20mm !important;
          }
        }
        .preview-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
        }
        .preview-content li {
          margin-bottom: 0.25rem;
        }
        .preview-content p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
});

export default ResumePreview;
