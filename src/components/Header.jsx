import { escotelLogo } from "../utils/constants";

export const Header = () => {
  return (
    <header className="masthead">
      <div className="logo-chip">
        <img src={escotelLogo} alt="Logotipo de Escotel" />
        <span>PORTAL DE PROVEEDORES</span>
      </div>
    </header>
  );
};