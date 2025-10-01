export default function Header() {
  return (
    <header className="p-4">
      <nav className="flex items-center max-w-7xl mx-auto px-4">
        <h1 className="font-bold text-2xl">Profilo</h1>
        <ul className="flex ml-auto space-x-10">
          <li>Home</li>
          <li>About</li>
          <li>Contacts</li>
          <li>FAQ</li>
        </ul>
      </nav>
    </header>
  );
}