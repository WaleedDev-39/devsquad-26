import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Save, Download, ArrowLeft, Plus, Trash2,
  User, Briefcase, GraduationCap, Code, Globe, MessageSquare,
  Layers, Languages
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ResumePreview from '../components/ResumePreview';
import { useReactToPrint } from 'react-to-print';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();

  const [resume, setResume] = useState({
    personalInfo: {
      fullName: '', email: '', phone: '', address: '',
      linkedin: '', github: '', website: '', summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: []
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/resumes/${id}`)
        .then(res => {
          const data = res.data;
          // Ensure all array fields exist
          const initializedData = {
            ...data,
            experience: data.experience || [],
            education: data.education || [],
            skills: data.skills || [],
            projects: data.projects || [],
            languages: data.languages || []
          };
          setResume(initializedData);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', location: '', startDate: '', endDate: '', description: '', current: false }]
    }));
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...resume.experience];
    newExp[index][field] = value;
    setResume(prev => ({ ...prev, experience: newExp }));
  };

  const removeExperience = (index) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...resume.education];
    newEdu[index][field] = value;
    setResume(prev => ({ ...prev, education: newEdu }));
  };

  const removeEducation = (index) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skill) => {
    if (skill && !resume.skills.includes(skill)) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addLanguage = (lang) => {
    if (lang && !resume.languages.includes(lang)) {
      setResume(prev => ({ ...prev, languages: [...(prev.languages || []), lang] }));
    }
  };

  const removeLanguage = (index) => {
    setResume(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/resumes/${id}`, resume);
      } else {
        const res = await axios.post('http://localhost:5000/api/resumes', resume);
        navigate(`/editor/${res.data._id}`);
      }
      alert('Resume saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving resume');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resume.personalInfo.fullName || 'Resume'}_CV`,
  });

  const exportToWord = () => {
    const content = componentRef.current.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${resume.personalInfo.fullName || 'Resume'}_CV.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const sections = [
    { id: 'personal', icon: <User size={18} />, label: 'Personal Info' },
    { id: 'experience', icon: <Briefcase size={18} />, label: 'Experience' },
    { id: 'education', icon: <GraduationCap size={18} />, label: 'Education' },
    { id: 'skills', icon: <Code size={18} />, label: 'Skills' },
    { id: 'projects', icon: <Layers size={18} />, label: 'Projects' },
    { id: 'languages', icon: <Languages size={18} />, label: 'Languages' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="glass px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Resume Editor</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveResume}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Download size={18} /> PDF
            </button>
            <button
              onClick={exportToWord}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Download size={18} /> Word
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-20 lg:w-64 glass border-r-0 flex flex-col p-4 gap-2">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeSection === s.id ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800'}`}
            >
              <span className={activeSection === s.id ? 'text-white' : 'text-slate-400'}>{s.icon}</span>
              <span className={`hidden lg:block font-medium ${activeSection === s.id ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
            </button>
          ))}
        </aside>

        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0f172a]">
          <div className="max-w-3xl mx-auto">
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Full Name</label>
                    <input type="text" name="fullName" value={resume.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Email Address</label>
                    <input type="email" name="email" value={resume.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Phone Number</label>
                    <input type="text" name="phone" value={resume.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="+1 234 567 890" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Location</label>
                    <input type="text" name="address" value={resume.personalInfo.address} onChange={handlePersonalInfoChange} placeholder="New York, USA" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">LinkedIn</label>
                    <input type="text" name="linkedin" value={resume.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/username" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">GitHub</label>
                    <input type="text" name="github" value={resume.personalInfo.github} onChange={handlePersonalInfoChange} placeholder="github.com/username" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Professional Summary</label>
                  <textarea
                    name="summary"
                    value={resume.personalInfo.summary}
                    onChange={handlePersonalInfoChange}
                    placeholder="Briefly describe your career goals and achievements..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Work Experience</h3>
                  <button onClick={addExperience} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
                    <Plus size={20} /> Add Experience
                  </button>
                </div>
                {resume.experience.map((exp, index) => (
                  <div key={index} className="glass p-6 rounded-2xl space-y-4 relative">
                    <button onClick={() => removeExperience(index)} className="absolute top-6 right-6 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Company</label>
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} placeholder="Google" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Role</label>
                        <input type="text" value={exp.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} placeholder="Senior Developer" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} placeholder="Jan 2020" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">End Date</label>
                        <input type="text" value={exp.endDate} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} placeholder="Present" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Description (Format with bullets, etc.)</label>
                      <div className="bg-slate-900 rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={exp.description}
                          onChange={(val) => updateExperience(index, 'description', val)}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Education</h3>
                  <button onClick={addEducation} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
                    <Plus size={20} /> Add Education
                  </button>
                </div>
                {resume.education.map((edu, index) => (
                  <div key={index} className="glass p-6 rounded-2xl space-y-4 relative">
                    <button onClick={() => removeEducation(index)} className="absolute top-6 right-6 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Institution</label>
                        <input type="text" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="MIT" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Bachelor's" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Field of Study</label>
                        <input type="text" value={edu.field} onChange={(e) => updateEducation(index, 'field', e.target.value)} placeholder="Computer Science" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Year</label>
                        <input type="text" value={edu.endDate} onChange={(e) => updateEducation(index, 'endDate', e.target.value)} placeholder="2018 - 2022" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Skills</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a skill (e.g. React, Node.js)"
                      id="skillInput"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('skillInput');
                        addSkill(input.value);
                        input.value = '';
                      }}
                      className="bg-indigo-600 px-6 rounded-lg font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {resume.skills.map(skill => (
                      <span key={skill} className="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full flex items-center gap-2 border border-indigo-500/30">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-white">
                          <Plus size={16} className="rotate-45" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Projects</h3>
                  <button onClick={() => setResume(prev => ({ ...prev, projects: [...prev.projects, { title: '', link: '', description: '', technologies: [] }] }))} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
                    <Plus size={20} /> Add Project
                  </button>
                </div>
                {resume.projects.map((proj, index) => (
                  <div key={index} className="glass p-6 rounded-2xl space-y-4 relative">
                    <button onClick={() => setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }))} className="absolute top-6 right-6 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Project Title</label>
                        <input type="text" value={proj.title} onChange={(e) => {
                          const newProj = [...resume.projects];
                          newProj[index].title = e.target.value;
                          setResume(prev => ({ ...prev, projects: newProj }));
                        }} placeholder="E-commerce App" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Link (Optional)</label>
                        <input type="text" value={proj.link} onChange={(e) => {
                          const newProj = [...resume.projects];
                          newProj[index].link = e.target.value;
                          setResume(prev => ({ ...prev, projects: newProj }));
                        }} placeholder="https://github.com/..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Description</label>
                      <textarea value={proj.description} onChange={(e) => {
                        const newProj = [...resume.projects];
                        newProj[index].description = e.target.value;
                        setResume(prev => ({ ...prev, projects: newProj }));
                      }} placeholder="Short description of the project..." rows={3} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'languages' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Languages</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a language (e.g. English, Urdu)"
                      id="langInput"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addLanguage(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('langInput');
                        addLanguage(input.value);
                        input.value = '';
                      }}
                      className="bg-indigo-600 px-6 rounded-lg font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {resume.languages.map((lang, idx) => (
                      <span key={`${lang}-${idx}`} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full flex items-center gap-2 border border-slate-700">
                        {lang}
                        <button onClick={() => removeLanguage(idx)} className="hover:text-white">
                          <Plus size={16} className="rotate-45" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Live Preview Area */}
        <section className="hidden xl:block w-[600px] bg-slate-900 overflow-y-auto p-12 border-l border-slate-800">
          <div className="scale-[0.85] origin-top">
            <ResumePreview resume={resume} ref={componentRef} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeEditor;
