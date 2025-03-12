import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user session data (if applicable)
    localStorage.removeItem("user");
    navigate("/"); // Redirect to Home page
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
      <span>Logout</span>
    </Button>
  );
}
