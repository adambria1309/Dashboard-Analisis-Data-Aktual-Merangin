import DownloadDataClient from "@/components/downloads/DownloadDataClient";
import { getDashboardDatasetSummaries, getUploadedDownloadFiles } from "@/lib/download-data";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DownloadDataPage() {
  const user = await requireUser();
  const [datasets, files] = await Promise.all([
    getDashboardDatasetSummaries(),
    getUploadedDownloadFiles(),
  ]);

  return <DownloadDataClient role={user.role} datasets={datasets} files={files} />;
}
