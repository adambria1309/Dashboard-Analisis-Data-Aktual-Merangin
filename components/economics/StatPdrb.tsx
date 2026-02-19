import Image from "next/image";
import logoPdrb from '@/img/financial.png';
import DownGrowth from '@/img/downgrowth.png';
import UpGrowth from '@/img/upgrowth.png';
import { Card, CardContent} from '@/components/ui/card';
import dataPdrbExp from '@/data/pdrb_exp';
import { ExpKey } from '@/types/expkey';
import { ArrowDownToDot } from 'lucide-react';
import { ArrowUpFromDot } from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

interface Props {
    selectedPdrbExp: ExpKey;
    setSelectedPdrbExp: (value: ExpKey) => void;
}

const StatPdrb:React.FC<Props> = ({selectedPdrbExp, setSelectedPdrbExp}) => {
    
    const data2024 = dataPdrbExp[8]; // asumsikan sebagai suatu objek array
    const data2023 = dataPdrbExp[7]; 
    const selectedValue2024 = selectedPdrbExp && data2024[selectedPdrbExp as keyof typeof data2024];
    const selectedValue2023 = selectedPdrbExp && data2023[selectedPdrbExp as keyof typeof data2023];

    // const title = selectedPdrbExp ? `PDRB Sektor ${selectedPdrbExp}` : 'Pilih sektor terlebih dahulu';
    const share =
        selectedPdrbExp && data2024[selectedPdrbExp as keyof typeof data2024]
        ? Math.round((Number(data2024[selectedPdrbExp as keyof typeof data2024]) / Number(data2024.PDRB)) * 100 * 100)/100
        : 0;

    const growthSektorPdrb = 
        selectedPdrbExp && data2024[selectedPdrbExp as keyof typeof data2024] && data2023[selectedPdrbExp as keyof typeof data2023] 
        ? Math.round((Number(data2024[selectedPdrbExp as keyof typeof data2024])-(Number(data2023[selectedPdrbExp as keyof typeof data2023]))) / (Number(data2024[selectedPdrbExp as keyof typeof data2024])) * 100 * 100)/100
        : 0;  

    const growthPdrb = Math.round((data2024.PDRB-data2023.PDRB)/data2023.PDRB*100*100)/100
    
    const filteredItem = dataPdrbExp.find((item) => item.Tahun === 2024);
    
    if (!filteredItem) return null;

    const shareDonut = (filteredItem[selectedPdrbExp] as number)/filteredItem["PDRB"]*100;

    const chartData = [
        { name: selectedPdrbExp, value: shareDonut },
    ];

    const namaExpDummy = selectedPdrbExp;
    const namaExpList: Record<string, string> = {
        'KonsumsiRumahTangga':'Konsumsi RT',
        'KonsumsiPemerintah':'Konsumsi Pemerintah',
        'KonsumsiLNPRT':'Konsumsi LNPRT',
        'PMTB':'PMTB',
        'PerubahanInventori':'Perubahan Inventori',
        'NetEkspor':'Net Ekspor'
    };

    const namaExp = namaExpList[namaExpDummy] || namaExpDummy;
    
    return (
        <>
        <div className="w-[30vw] grid grid-cols-2 grid-rows-[6vh,12vh,12vh] justify-between gap-y-2 gap-x-5">
            <div className='flex items-center justify-center h-[6vh] bg-blue-100/60 backdrop-filter backdrop-blur-md pt-0 col-span-2 col-start-1 grid-row-1 border-1 border-slate-200 rounded-md'>
                <div className='w-[50%] h-[90%] justify-center items-center bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md'>
                    <h4 className="text-3l text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                        Tahun 2024
                    </h4>
                </div>
            </div>
            <div className='grid-row-2'>
                <Card className="w-full bg-blue-100/60 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[32vh] w-[100%] pl-1 pr-1 pb-0 mr-54">
                <CardContent>
                    <div className='grid grid-col-1 grid-row-[30%,50%,20%]'>
                        <div className='w-[130%] h-[100%] pb-3 grid grid-row-2 grid-col-1 gap-y-0 bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md mt-[-10%] ml-[-15%] mr-[0%]'>
                            <div className=''>
                                <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                    Nilai Kategori
                                </h2>
                            </div>
                            <div className='flex justify-center items-center'>
                                <hr className='w-[90%] h-2 border-[#5ea9ffff] dark:border-white'/>
                            </div>
                            <div className='mt-[-5%]'>
                                <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                    {`${namaExp}`}
                                </h2>
                            </div>
                        </div>
                        <div className='w-[130%] h-full mt-[-5%] pt-1 pb-1 flex justify-center items-center bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md ml-[-15%] mr-[0]'>
                            <div>
                                <Image src={logoPdrb} alt="PDRB" width={85} />
                            </div>
                        </div>
                        <div className="w-[130%] mt-[-1%] flex justify-center items-center pl-[30%] pr-[30%] h-[100%] bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md ml-[-15%] mr-[0]">
                            <div>
                                <span className='font-semibold text-[#168ad8ff] dark:text-blue-200'>
                                    {selectedValue2024 ? selectedValue2024 : "-"}
                                </span>
                            </div>
                        </div>                    
                    </div>
                </CardContent>
                </Card>
            </div>
            <Card className="w-full bg-blue-100/60 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[32vh] w-[100%] pl-1 pr-1 pb-0 mr-54">
            <CardContent>
                <div className="grid grid-col-1 grid-row-[30%,50%,20%]">
                    <div className='w-[130%] h-[100%] pb-3 grid grid-row-2 grid-col-1 gap-y-0 bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md ml-[-15%] mr-[0%] mt-[-10%]'>
                        <div className=''>
                            <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                <i>Share</i> Kategori
                            </h2>
                        </div>
                        <div className='flex justify-center items-center'>
                            <hr className='w-[90%] h-2 border-[#5ea9ffff] dark:border-white'/>
                        </div>
                        <div className='mt-[-5%]'>
                            <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                {`${namaExp}`||"-"}
                            </h2>
                        </div>
                    </div>
                    <div className='h-[60%] w-[130%] mt-[-3%] bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md ml-[-15%] mr-[0]'>
                        <ResponsiveContainer width="100%" height={150}>
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="40%"
                                outerRadius="100%"
                                startAngle={180}
                                endAngle={0}
                                data={chartData}
                                barSize={500}
                            >
                                <PolarAngleAxis type="number" domain={[0, shareDonut>40?100:shareDonut<1?20:90]} tick={false}/>
                                <RadialBar
                                dataKey="value"
                                data={[chartData[0]]} // actual bar
                                fill="#5ea9ffff"
                                background={{fill: '#cadeebff'}}
                                cornerRadius={3}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-[130%] mt-[-45%] flex justify-center items-center pl-[30%] pr-[30%] pt-3 pb-3 h-[100%] bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md ml-[-15%] mr-[0%]">
                        <div>
                            <span className='font-semibold text-[#168ad8ff] dark:text-blue-200'>
                                {selectedValue2024 ? `${share}%` : "-"}
                            </span>
                        </div>
                    </div>
                </div> 
            </CardContent>
        </Card>
        <Card className="w-full bg-blue-100/60 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[32vh] w-[100%] pl-1 pr-1 pb-0 mr-54">
            <CardContent>
                <div className="grid grid-col-1 grid-row-[30%,50%,20%]">
                    <div className='w-[130%] h-[100%] pb-3 grid grid-row-2 grid-col-1 gap-y-0 bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md ml-[-15%] mr-[0%] mt-[-10%]'>
                        <div className=''>
                            <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                <i>Growth</i> Kategori
                            </h2>
                        </div>
                        <div className='flex justify-center items-center'>
                            <hr className='w-[90%] h-2 border-[#5ea9ffff] dark:border-white'/>
                        </div>
                        <div className='mt-[-5%]'>
                            <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                {`${namaExp}`||"-"}
                            </h2>
                        </div>
                    </div>
                {selectedValue2024 ? (
                    <div className="w-full grid grid-col-1 grid-row-2 gap-y-1">
                        <div className='grid-row-1'>
                            <div className="mt-[-5%] flex justify-center items-center bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md">
                                {growthSektorPdrb >= 0 ? (
                                <ArrowUpFromDot size={90} className="text-green-600" />
                                ) : (
                                <ArrowDownToDot className="text-red-600" />
                                )}
                            </div>
                        </div>
                        <div className='grid-row-2 flex pl-[30%] pr-[30%] h-full bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md'>
                            <div className="justify-center items-center">
                                <span className='font-semibold text-[#168ad8ff] dark:text-blue-200 ml-[10%]'>{`${growthSektorPdrb}%`}</span>
                            </div>
                        </div>
                    </div>
                    ) : "-"}
                </div>
            </CardContent>
        </Card>
        <Card className="w-full bg-blue-100/60 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[32vh] w-[100%] pl-1 pr-1 pb-0 mr-54">
            <CardContent>
                <div className="grid grid-col-1 col-row-[30%,50%,20%]">
                    <div className='w-[100%] h-[100%] pb-3 grid grid-row-2 grid-col-1 gap-y-0 bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md mt-[-10%]'>
                        <div className=''>
                            <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                <i>Growth</i> PDRB
                            </h2>
                        </div>
                        <div className='flex justify-center items-center'>
                            <hr className='w-[90%] h-2 border-[#5ea9ffff] dark:border-white'/>
                        </div>
                        <div className='mt-[-5%]'>
                            <h2 className="text-center font-bold text-[#168ad8ff] dark:text-blue-200">
                                Total
                            </h2>
                        </div>
                    </div>
                    <div className="mt-[-7%] flex justify-center items-center bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md">
                                {growthSektorPdrb >= 0 ? (
                                <Image src={UpGrowth} alt="PDRB Meningkat" width={90}/>
                                ) : (
                                <Image src={DownGrowth} alt="PDRB Menurun" width={90}/>
                                )}
                    </div>
                    <div className='mt-[2.5%] grid-row-2 flex pl-[30%] pr-[30%] h-full bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md'>
                            <div className="justify-center items-center">
                                <span className='font-semibold text-[#168ad8ff] dark:text-blue-200'>{`${growthPdrb}%`}</span>
                            </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        </div>
        </>
    );
};

export default StatPdrb;