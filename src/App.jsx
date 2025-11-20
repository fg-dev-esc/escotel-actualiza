import { useParams } from "react-router-dom";
import "./App.css";

import { Header } from "./components/Header";
import { ProviderForm } from "./components/ProviderForm";

export default function App() {
  const { providerId } = useParams();

  return (
    <main className="app-shell">
      <Header />

      <div className="layout">
        <section className="panel">
          <ProviderForm providerId={providerId || "default"} />
        </section>
      </div>
    </main>
  );
}
