import { AuthLoadingSkeleton } from "@/components/loading/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <AuthLoadingSkeleton />
    </div>
  );
}
