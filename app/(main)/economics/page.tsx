import AnalyticsStat from "@/components/economics/AnalyticsStatEco";
import AdminDashboardDataLink from "@/components/admin/AdminDashboardDataLink";
import { requireUser } from "@/lib/auth";

const EconomicsPage = async () => {
    const user = await requireUser();

    return(
        <>
            {user.role === "admin" && <AdminDashboardDataLink />}
            <AnalyticsStat />
        </>
    );
};

export default EconomicsPage;
