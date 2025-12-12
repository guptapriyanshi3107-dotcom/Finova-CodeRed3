import { SignOutButton } from "../SignOutButton";

const menuItems = [
  { icon: "🏠", label: "Overview" },
  { icon: "🤖", label: "Ask FinPal" },
  { icon: "📊", label: "Budget Planner" },
  { icon: "💰", label: "Expense Tracker" },
  { icon: "🎯", label: "Financial Goals" },
  { icon: "📈", label: "Investing & Trading" },
  { icon: "💡", label: "Smart Suggestions" },
  { icon: "📋", label: "Insights & Reports" },
  { icon: "🧮", label: "Calculators" },
  { icon: "🧠", label: "Personality Test" }, // Added questionnaire access
  { icon: "📚", label: "Learn & Grow" },
  { icon: "⚙️", label: "Settings" },
];

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <div className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm sidebar-scroll z-50 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:z-auto`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
            F
          </div>
          <div>
            <h2 className="font-finova text-xl text-teal-600">Finova</h2>
            <p className="text-xs text-gray-500">Finance & Innovation</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActivePage(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activePage === item.label
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
