import { type ReactNode } from "react";
import { Container } from "@/components/Container";
import { TopNav } from "@/components/TopNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="py-6">
        <Container>{children}</Container>
      </main>
    </div>
  );
}

