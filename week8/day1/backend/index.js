const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

// Persistent File-based storage fallback
const DB_FILE = path.join(__dirname, 'resumes.json');

const loadResumes = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return [];
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
};

const saveResumes = (resumes) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(resumes, null, 2));
        console.log(`✅ Saved ${resumes.length} resumes to ${DB_FILE}`);
    } catch (err) {
        console.error('❌ Error saving resumes to file:', err.message);
    }
};

// Initialize file if not exists
if (!fs.existsSync(DB_FILE)) {
    saveResumes([]);
}

let inMemoryResumes = loadResumes();
let isDbConnected = false;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cvbuilder')
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        isDbConnected = true;
    })
    .catch(err => {
        console.log('💡 Offline Mode: MongoDB not detected at 127.0.0.1:27017.');
        console.log('   Data will be saved locally to: ' + DB_FILE);
        console.log('   (To use MongoDB, start your local service or provide MONGODB_URI in a .env file)');
        isDbConnected = false;
    });

// Resume Schema
const resumeSchema = new mongoose.Schema({
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        linkedin: String,
        github: String,
        website: String,
        summary: String,
    },
    experience: [{
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
        current: Boolean,
    }],
    education: [{
        institution: String,
        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    skills: [String],
    projects: [{
        title: String,
        link: String,
        description: String,
        technologies: [String],
    }],
    languages: [String],
    createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model('Resume', resumeSchema);

// Routes
app.get('/api/resumes', async (req, res) => {
    try {
        if (!isDbConnected) return res.json(inMemoryResumes);
        const resumes = await Resume.find().sort({ createdAt: -1 });
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/resumes', async (req, res) => {
    try {
        if (!isDbConnected) {
            const newResume = { ...req.body, _id: Date.now().toString(), createdAt: new Date() };
            inMemoryResumes.push(newResume);
            saveResumes(inMemoryResumes);
            return res.status(201).json(newResume);
        }
        const resume = new Resume(req.body);
        const newResume = await resume.save();
        res.status(201).json(newResume);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/api/resumes/:id', async (req, res) => {
    try {
        if (!isDbConnected) {
            const resume = inMemoryResumes.find(r => r._id === req.params.id);
            if (!resume) return res.status(404).json({ message: 'Resume not found' });
            return res.json(resume);
        }
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/resumes/:id', async (req, res) => {
    try {
        if (!isDbConnected) {
            const index = inMemoryResumes.findIndex(r => r._id === req.params.id);
            if (index !== -1) {
                inMemoryResumes[index] = { ...inMemoryResumes[index], ...req.body };
                saveResumes(inMemoryResumes);
                return res.json(inMemoryResumes[index]);
            }
            return res.status(404).json({ message: 'Resume not found' });
        }
        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: false, strict: false }
        );
        res.json(updatedResume);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/resumes/:id', async (req, res) => {
    try {
        if (!isDbConnected) {
            inMemoryResumes = inMemoryResumes.filter(r => r._id !== req.params.id);
            saveResumes(inMemoryResumes);
            return res.json({ message: 'Resume deleted' });
        }
        await Resume.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resume deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running and listening on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please close the other process or use a different port.`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
