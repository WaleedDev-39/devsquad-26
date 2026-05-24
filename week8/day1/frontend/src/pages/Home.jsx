import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FilePlus, FileText, Trash2, Edit, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/resumes');
      setResumes(res.data);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`http://localhost:5000/api/resumes/${id}`);
        setResumes(resumes.filter((r) => r._id !== id));
      } catch (err) {
        console.error('Error deleting resume:', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text">ProResume Builder</h1>
          <p className="text-slate-400 mt-2">Create professional resumes in minutes.</p>
        </motion.div>
        
        <Link 
          to="/editor" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} />
          Create New Resume
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 glass rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <motion.div
              key={resume._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <FileText className="text-indigo-400" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteResume(resume._id)} className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-1 truncate">{resume.personalInfo?.fullName || 'Untitled Resume'}</h3>
                <p className="text-slate-400 text-sm mb-3">Last updated: {new Date(resume.createdAt).toLocaleDateString()}</p>
                
                {resume.languages && resume.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-6">
                    {resume.languages.slice(0, 3).map((lang, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                        {lang}
                      </span>
                    ))}
                    {resume.languages.length > 3 && (
                      <span className="text-[10px] text-slate-500 px-1 py-0.5">+{resume.languages.length - 3} more</span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Link 
                    to={`/editor/${resume._id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit size={16} /> Edit
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <Download size={16} /> PDF
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 glass rounded-3xl"
        >
          <div className="inline-flex p-6 bg-slate-800/50 rounded-full mb-6">
            <FilePlus size={48} className="text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No resumes found</h2>
          <p className="text-slate-400 mb-8">Start by creating your first professional resume.</p>
          <Link 
            to="/editor" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-full font-bold transition-all"
          >
            Create My First Resume
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
