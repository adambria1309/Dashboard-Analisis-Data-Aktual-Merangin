import { Card, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCradProps {
    title: string;
    count: number;
    icon: React.ReactElement<LucideIcon>
};

const DashboardCard = ({ title, count, icon }: DashboardCradProps) => {
    return (
      <>
        <Card className="bg-slate-100 dark:bg-slate-800 pl-10 pr-10 pt-1 pb-1">
            <CardContent>
                <h3 className="text-1xl text-center mb-0 font-bold text-slate-500 dark:text-slate-200">
                    {title}
                </h3>
                <div className="flex gap-5 justify-center items-center">
                    { icon }
                    <h3 className="text-3xl font-semibold text-slate-500 dark:text-slate-200">
                        {count}
                    </h3>
                </div>
            </CardContent>
        </Card>
      </>  
    );
};

export default DashboardCard;
