import Header from "./components/header/page"
import Main from "./components/main/page"

export default function Home() {
  return (
    <div className="bg-[#121212] text-white w-[100%] min-h-screen">
      <Header/>
      <Main/>
    </div>
  );
}
