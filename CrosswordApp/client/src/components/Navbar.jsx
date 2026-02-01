import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Dock from "./Dock";
import { VscHome, VscEdit, VscAccount, VscSignIn, VscSignOut, VscKey } from "react-icons/vsc";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    {
      icon: <VscHome size={24} className="text-white" />,
      label: 'Home',
      onClick: () => navigate('/')
    },
  ];

  if (isAuthenticated) {
    items.push(
      {
        icon: <VscEdit size={24} className="text-white" />,
        label: 'Create Post',
        onClick: () => navigate('/create')
      },
      {
        icon: <VscAccount size={24} className="text-white" />,
        label: user?.username || 'Profile',
        onClick: () => navigate('/profile')
      },
      {
        icon: <VscSignOut size={24} className="text-red-400" />,
        label: 'Logout',
        onClick: async () => {
          await logout();
          navigate('/login');
        }
      }
    );
  } else {
    items.push(
      {
        icon: <VscSignIn size={24} className="text-white" />,
        label: 'Login',
        onClick: () => navigate('/login')
      },
      {
        icon: <VscKey size={24} className="text-white" />,
        label: 'Register',
        onClick: () => navigate('/register')
      }
    );
  }

  return (
    <div className="relative z-[9999]">
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={90}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 origin-bottom scale-75 sm:scale-100 sm:bottom-6"
      />
    </div>
  );
}

export { Navbar };
