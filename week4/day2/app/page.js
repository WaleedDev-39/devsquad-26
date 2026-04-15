import Header from '@/components/Header';
import JobList from '@/components/JobList';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative pb-20">
      <Header />
      <div className="container mx-auto px-6 max-w-6xl relative -mt-9">
        <FilterBar />
        <div className="mt-14">
          <JobList />
        </div>
      </div>
    </main>
  );
}
