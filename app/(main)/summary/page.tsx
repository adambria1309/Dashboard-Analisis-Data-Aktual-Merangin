import AnalyticsStat from "@/components/summary/AnalyticsStat";
import AdminDashboardDataLink from "@/components/admin/AdminDashboardDataLink";
import { requireUser } from "@/lib/auth";

const SummaryPage = async () => {
    const user = await requireUser();

    return(
        <>
            {user.role === "admin" && <AdminDashboardDataLink />}
            <AnalyticsStat />
        </>
    );
};

export default SummaryPage;
