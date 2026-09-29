import Sidebar from "/.Sidebar";
import Banner from "./Banner";
import LinksRapidos from "./LinksRapidos";
import Comunicados from "./Comunicados";

function App() {
  const nossoSite = "https://";

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-800">
      <Sidebar />

      <main className="ml-[270px] p-7">
        <Banner />

        <LinksRapidos nossoSite={nossoSite} />

        <Comunicados />
      </main>
    </div>
  );
}

export default App;