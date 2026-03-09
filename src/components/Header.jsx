import logo from '../assets/react.svg'; 

export default function Header() {
  return (
    <header className="app-header">
      <img src={logo} alt="Logo" className="header-logo" />
      <h1>CardioLife</h1>
    </header>
  );
}