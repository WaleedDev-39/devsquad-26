import { notFound } from 'next/navigation';
import Link from 'next/link';
import FilterTag from '@/components/FilterTag';
import data from '@/data.json';

export default async function JobDetail({ params }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  const jobs = data;

  const job = jobs.find(j => j.id === id);

  if (!job) {
    notFound();
  }

  const tags = [
    job.role,
    job.level,
    ...(job.languages || []),
    ...(job.tools || [])
  ];

  return (
    <main className="min-h-screen flex flex-col relative pb-20">
      <header className="bg-primary h-[156px] w-full overflow-hidden relative">
        <div 
          className="w-full h-full bg-cover bg-center sm:bg-[url('/images/bg-header-mobile.svg')] md:bg-[url('/images/bg-header-desktop.svg')]"
          aria-hidden="true"
        />
      </header>
      
      <div className="container mx-auto px-6 max-w-4xl relative -mt-9">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-card px-5 py-3 rounded-md shadow-card font-bold mb-10 text-primary hover:text-primary hover:bg-neutral-bg transition-colors duration-300"
        >
          ← Back to Listings
        </Link>
        
        <div className="bg-card rounded-md shadow-card p-8 md:p-12 relative mt-8">
          <div className="absolute -top-10 flex-shrink-0">
            <img 
              src={job.logo} 
              alt={`${job.company} logo`} 
              className="w-20 h-20"
            />
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row justify-between md:items-start gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-primary text-lg">{job.company}</span>
                {job.new && (
                  <span className="bg-primary text-white font-bold text-xs uppercase rounded-full px-2 py-1 leading-none">
                    New!
                  </span>
                )}
                {job.featured && (
                  <span className="bg-neutral-very-dark text-white font-bold text-xs uppercase rounded-full px-2 py-1 leading-none">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="font-bold text-neutral-very-dark text-3xl mb-4">
                {job.position}
              </h1>
              
              <div className="flex items-center gap-4 text-neutral-dark text-base">
                <span>{job.postedAt}</span>
                <span className="flex items-center justify-center w-[4px] h-[4px] rounded-full bg-neutral-dark"></span>
                <span>{job.contract}</span>
                <span className="flex items-center justify-center w-[4px] h-[4px] rounded-full bg-neutral-dark"></span>
                <span>{job.location}</span>
              </div>
            </div>
            
            <div className="md:w-1/3 bg-neutral-bg rounded-lg p-6">
              <h3 className="font-bold text-neutral-very-dark mb-4 border-b border-primary/20 pb-2">Requirements</h3>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag, index) => (
                  <FilterTag key={index} text={tag} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-10 border-t border-neutral-filter text-neutral-dark leading-relaxed">
            <h3 className="font-bold text-neutral-very-dark text-xl mb-4">About the Role</h3>
            <p className="mb-6">
              We are looking for a <span className="font-bold text-primary">{job.position}</span> to join our team at <span className="font-bold">{job.company}</span>. 
              This is a <span className="font-bold">{job.contract}</span> position based in <span className="font-bold">{job.location}</span>.
            </p>
            <p className="mb-6">
              As a member of our {job.role} team, you will be working alongside talented engineers to build accessible, performant, and delightful user experiences. 
              We value clean code, strong testing practices, and empathy for our users.
            </p>
            <p>
              Expected skillset includes proficiency in {tags.slice(2).join(', ')}. If you are passionate about what you do and want to work on a product that matters, 
              we'd love to hear from you.
            </p>
            
            <button className="mt-10 bg-primary hover:bg-neutral-very-dark text-white font-bold py-4 px-10 rounded-md transition-colors text-lg">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
