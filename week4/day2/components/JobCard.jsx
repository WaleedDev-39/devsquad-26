'use client';

import useFilterStore from '@/store/useFilterStore';
import FilterTag from './FilterTag';

export default function JobCard({ job }) {
  const { addFilter } = useFilterStore();
  
  const tags = [
    job.role,
    job.level,
    ...(job.languages || []),
    ...(job.tools || [])
  ];

  return (
    <div className={`bg-card rounded-md shadow-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between relative mt-12 md:mt-6 transition-all duration-300 hover:shadow-lg ${job.featured ? 'border-l-[5px] border-l-primary' : ''}`}>
      
      {/* Logo peeks out on mobile, standard size on desktop */}
      <div className="absolute -top-6 md:static md:top-0 md:mr-6 flex-shrink-0">
        <img 
          src={job.logo} 
          alt={`${job.company} logo`} 
          className="w-12 h-12 md:w-[88px] md:h-[88px]"
        />
      </div>

      <div className="flex flex-col flex-grow mt-2 md:mt-0">
        <div className="flex items-center gap-3 mb-2 md:mb-1">
          <span className="font-bold text-primary mr-1 text-[13px] md:text-sm">{job.company}</span>
          
          {job.new && (
            <span className="bg-primary text-white font-bold text-[11px] uppercase rounded-full px-2 pt-1 pb-0.5 leading-none h-6 flex items-center">
              New!
            </span>
          )}
          
          {job.featured && (
            <span className="bg-neutral-very-dark text-white font-bold text-[11px] uppercase rounded-full px-2 pt-1 pb-0.5 leading-none h-6 flex items-center">
              Featured
            </span>
          )}
        </div>
        
        <h2 className="font-bold text-neutral-very-dark text-base md:text-xl md:mb-1 cursor-pointer hover:text-primary transition-colors">
          {job.position}
        </h2>
        
        <div className="flex items-center gap-3 text-neutral-dark text-[13px] md:text-[15px] pt-1 pb-3 md:pb-0">
          <span>{job.postedAt}</span>
          <span className="flex items-center justify-center w-[3px] h-[3px] rounded-full bg-neutral-dark"></span>
          <span>{job.contract}</span>
          <span className="flex items-center justify-center w-[3px] h-[3px] rounded-full bg-neutral-dark"></span>
          <span>{job.location}</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-neutral-dark bg-opacity-30 my-4 md:hidden"></div>

      <div className="flex flex-wrap gap-4 items-center pl-0 md:pl-6 justify-start md:justify-end">
        {tags.map((tag, index) => (
          <FilterTag 
            key={`${tag}-${index}`} 
            text={tag} 
            onClick={() => addFilter(tag)} 
          />
        ))}
      </div>
    </div>
  );
}
