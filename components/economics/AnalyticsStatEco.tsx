import { useState } from "react";
import AnalyticsChart from "./AnalyticsChart";

const AnalyticsStat =() => {
    const [selectedPdrb, setSelectedPdrb] = useState<string>("");
    const [selectedSoceko, setSelectedSoceko] = useState<string>("");

    return (
        <>
            <AnalyticsChart />
        </>
    );
};

export default AnalyticsStat;