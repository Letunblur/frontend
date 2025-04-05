import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 px-6 border-b">
        <h1 className="text-xl font-bold">🔓 LetUnblur</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">{children}</main>

      <footer className="text-center text-xs text-muted-foreground py-6">
        © {new Date().getFullYear()} LetUnblur. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
