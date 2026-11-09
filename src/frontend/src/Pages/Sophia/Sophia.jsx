import Sidebar from "./SideBar";
import Banner from "./Banner";
import LinksRapidos from "./LinksRapidos";
import Comunicados from "./Comunicados";

function Sophia() {
  const nossoSite = "/selecionar-usuario";

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-800">
      <Sidebar />
      <main className="p-4 md:ml-67.5 md:p-7">
        <Banner />
        <LinksRapidos nossoSite={nossoSite} />
        <Comunicados />
      </main>
    </div>
  );
}

export default Sophia;
