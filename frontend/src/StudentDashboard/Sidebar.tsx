import { useState } from "react";
import Profile from "./Profile";
import HandsOnLearning from "./HandsOnLearning";
import Games from "./Games";
import Subscription from "./Subscription";
import StudentsLabHome from "./vsl/StudentsLabHome";
import TeacherLabHome from "../TeacherDashboard/TeacherLabHome";

type MenuItem = "Profile" | "Hands On Learning" | "Games" | "Subscription" | "Virtual Science Lab" | "Stats" | "Logout";

const menuItems: MenuItem[] = [
  "Profile",
  "Hands On Learning",
  "Games",
  "Virtual Science Lab",
  "Subscription",
  "Stats",
  "Logout",
];

const colors: Record<MenuItem, string> = {
  Profile: "text-purple-600",
  "Hands On Learning": "text-blue-600",
  Games: "text-orange-500",
  "Virtual Science Lab": "text-green-500",
  Subscription: "text-blue-500",
  Stats: "text-purple-500",
  Logout: "text-red-500",
};

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState<MenuItem>("Profile");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderComponent = () => {
    switch (selectedItem) {
      case "Profile":
        return <Profile />;
      case "Hands On Learning":
        return <HandsOnLearning />;
      case "Games":
        return <Games />;
      case "Virtual Science Lab":
        return <StudentsLabHome />;
      case "Subscription":
        return <Subscription />;
      case "Stats":
        return <TeacherLabHome />;
      case "Logout":
        return <div className="text-lg font-semibold text-red-500">Logging out...</div>;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="relative min-h-screen font-sans bg-blue/70 text-white">
      {/* Mobile Hamburger */}
      <div className="md:hidden flex justify-between items-center p-4 bg-purple-700 z-50">
        <h2 className="text-xl font-bold">🎮 My Fun Space</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Floating Sidebar for Mobile */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-[70%] h-auto bg-white/90 backdrop-blur-sm z-40 shadow-xl p-6">
          <h2 className="text-2xl font-extrabold mb-6 text-purple-700">🎮 My Fun Space</h2>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => {
                  setSelectedItem(item);
                  setMenuOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 hover:bg-purple-100 hover:scale-105 ${
                  selectedItem === item
                    ? `bg-purple-200 font-bold shadow-md ${colors[item]}`
                    : "text-gray-700"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white shadow-xl text-black rounded-tr-3xl rounded-br-3xl p-6">
        <h2 className="text-2xl font-extrabold mb-6 text-purple-700">🎮 My Fun Space</h2>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 hover:bg-purple-100 hover:scale-105 ${
                selectedItem === item
                  ? `bg-purple-200 font-bold shadow-md ${colors[item]}`
                  : "text-gray-700"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 p-6 h-[550px]">
        <div className="w-full max-w-5xl mx-auto">{renderComponent()}</div>
      </main>
    </div>
  );
}
