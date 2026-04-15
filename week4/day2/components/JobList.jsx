'use client';

import { useEffect, useState } from 'react';
import useFilterStore from '@/store/useFilterStore';
import JobCard from './JobCard';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useFilterStore();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (filters.length === 0) return true;
    
    const jobTags = [
      job.role,
      job.level,
      ...(job.languages || []),
      ...(job.tools || [])
    ];
    
    // Check if the job contains ALL active filters
    return filters.every(filter => jobTags.includes(filter));
  });

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 md:gap-5 pb-20">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))
      ) : (
        <div className="bg-card rounded-md shadow-card p-10 text-center">
          <p className="text-neutral-dark font-bold text-lg">No jobs found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
