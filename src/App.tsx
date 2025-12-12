import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-teal-50">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
            <h2 className="text-2xl font-finova text-teal-600">Finova</h2>
            <p className="text-sm text-gray-600 hidden md:block">Finance & Innovation</p>
          </header>
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <Content />
            </div>
          </main>
        </div>
      </Unauthenticated>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-6xl font-finova text-teal-600 mb-4">Finova</h1>
        <p className="text-xl text-gray-600 font-medium">Finance & Innovation</p>
        <p className="text-lg text-gray-500 mt-2">Smart decisions. Simple money.</p>
      </div>
      <SignInForm />
    </div>
  );
}
