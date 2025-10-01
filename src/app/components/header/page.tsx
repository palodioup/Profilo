export default function Header() {
  return (
    <header className="p-4">
      <nav className="flex items-center max-w-7xl mx-auto px-4">
        <h1 className="font-bold text-2xl m-2">Profilo</h1>
        <ul className="flex ml-auto space-x-10">
          <li className="hidden md:flex">Home</li>
          <li className="hidden md:flex">About</li>
          <li className="hidden md:flex">Contacts</li>
          <li className="hidden md:flex">FAQ</li>
        </ul>
      </nav>
    </header>
  );
}