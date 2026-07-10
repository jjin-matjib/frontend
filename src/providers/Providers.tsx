import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "./QueryProvider";
import { GlobalErrorModal } from "@/components/GlobalErrorModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        {children}
        <GlobalErrorModal />
      </QueryProvider>
    </NuqsAdapter>
  );
}
