import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
