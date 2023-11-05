import NavLinks from "@/components/NavLinks";
import Search from "@/components/Search";

export default function Dashboard() {
  return (
    <>
      <header>
        <section>
          <h1>Dashboard</h1>
          <NavLinks />
          <Search />
        </section>
      </header>
      <main>
        <div>
          <div>Messages Thread</div>
          <textarea>Message Input</textarea>
          <button>Video</button>
          <button>Audio</button>
          <button>Document</button>
        </div>
        <aside>Sidebar</aside>
      </main>
    </>
  );
}
