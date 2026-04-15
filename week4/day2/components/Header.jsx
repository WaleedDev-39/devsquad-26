import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-primary h-[156px] w-full overflow-hidden relative">
      <div 
        className="w-full h-full bg-cover bg-center sm:bg-[url('/images/bg-header-mobile.svg')] md:bg-[url('/images/bg-header-desktop.svg')]"
        aria-hidden="true"
      />
      <ThemeToggle />
    </header>
  );
}
