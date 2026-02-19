'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Label} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader,CardTitle} from '@/components/ui/card';
import dataPdrb from '@/data/pdrb_exp';
import { ExpKeys, ExpKey } from '@/types/expkey';
import StatPdrb from './StatPdrb';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; //render componnent di 'body' sehingga tidak terpengaruh dengan tailwind dan shadcn ui

// interface Props {
//     selectedPdrb: string;
//     setSelectedPdrb: (value: string) => void;
//     selectedSoceko: string;
//     setSelectedSoceko: (value: string) => void;
// }

const AnalyticsChart: React.FC = () => {

    // handler untuk pemilihan dan grafik PDRB
    const optionsPDRBExp = [
        { value: "KonsumsiRumahTangga", label: "Konsumsi Rumah Tangga" },
        { value: "KonsumsiLNPRT", label: "Konsumsi Lembaga Non Profit Rumah Tangga" },
        { value: "KonsumsiPemerintah", label: "Konsumsi Pemerintah" },
        { value: "PMTB", label: "Pembentukan Modal tetap Bruto" },
        { value: "PerubahanInventori", label: "Perubahan Inventori" },
        { value: "Ekspor", label: "Ekspor Barang Jasa" },
        { value: "NetEkspor", label: "Net Ekspor" }
        ];
    const [selectedPdrbExp, setSelectedPdrbExp] = useState<ExpKey>('KonsumsiRumahTangga');
      
    const [isOpenPdrbExp, setIsOpenPdrbExp] = useState(false);
    const [triggerPosPdrbExp, setTriggerPosPdrbExp] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
    const triggerRefPdrbExp = useRef<HTMLDivElement>(null);
    const dropdownRefPdrbExp = useRef<HTMLUListElement>(null);
    
    const toggleDropdownPdrb = () => {setIsOpenPdrbExp((prev) => !prev);};
    const handleSelectPdrb = (value: string) => {
        setSelectedPdrbExp(value as ExpKey);
        setIsOpenPdrbExp(false);
    };

    useEffect(() => {
        if (isOpenPdrbExp && triggerRefPdrbExp.current) {
            const rect = triggerRefPdrbExp.current.getBoundingClientRect();
            setTriggerPosPdrbExp({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [isOpenPdrbExp]);
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target=e.target as Node;
            if (!triggerRefPdrbExp.current?.contains(target) &&
            !dropdownRefPdrbExp.current?.contains(target)) {
                setIsOpenPdrbExp(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // handler untuk pemilihan dan grafik indikator sosial ekonomi
    const [isOpenSoceko, setIsOpenSoceko] = useState(false);
    const [triggerPosSoceko, setTriggerPosSoceko] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
    const triggerRefSoceko = useRef<HTMLDivElement>(null);
    const dropdownRefSoceko = useRef<HTMLUListElement>(null);
    
    const [selectedSoceko, setSelectedSoceko] = useState<string>('P0');
    const optionsSoceko = ["P0","TPT","PE","Gini"];

    const toggleDropdownSoceko = () => {setIsOpenSoceko((prev) => !prev);};
    const handleSelectSoceko = (value: string) => {
        setSelectedSoceko(value);
        setIsOpenSoceko(false);
    };

        useEffect(() => {
        if (isOpenSoceko && triggerRefSoceko.current) {
            const rect = triggerRefSoceko.current.getBoundingClientRect();
            setTriggerPosSoceko({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [isOpenSoceko]);
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target=e.target as Node;
            if (!triggerRefSoceko.current?.contains(target) &&
            !dropdownRefSoceko.current?.contains(target)) {
                setIsOpenSoceko(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Function to format large numbers (e.g., 10000 -> 10k)
    const kFormatter = (num:number) => {
    return Math.abs(num) > 999 ? ((Math.abs(num) / 1000)).toString() + "RB" : (num * Math.abs(num)).toString();
    };

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
    <div className='mt-[0%] grid grid-cols-5 grid-rows-1 gap-5'>
        <Card className='w-full col-span-3 col-start-1 bg-blue-50/60 backdrop-filter backdrop-blur-md'>
            <CardHeader>
                <div className='grid grid-col-1 grid-row-2 gap-y-2 bg-white/50 backdrop-filter backdrop-blur-md border-1 border-blue-100 rounded-md mt-[-2.5%]'>
                    <div className='ml-[1%] mt-[1%]'>
                        <CardTitle className='text-[#168ad8ff]'>PDRB Kabupaten Merangin (Milyar Rupiah)</CardTitle>
                    </div>
                    <div className='ml-[1%] mb-[1%]'>
                        {/* <CardDescription>{namaExp}</CardDescription> */}
                        <CardDescription>PDRB Kabupaten Merangin Menurut Pengeluaran</CardDescription>
                    </div>
                </div>
                <div
                    ref={triggerRefPdrbExp}
                    onClick={toggleDropdownPdrb}
                    className="w-full p-2 border border-white bg-[#168ad8ff] text-white cursor-pointer select-none rounded  flex justify-between items-center"
                >
                    <span> {optionsPDRBExp.find(opt => opt.value === selectedPdrbExp)?.label || 'Pilih Kategori PDRB'} </span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                {isOpenPdrbExp && createPortal(
                    <ul
                    ref={dropdownRefPdrbExp}
                    className="absolute z-50 bg-[#168ad8ff] text-white border border-white rounded shadow-md max-h-50 overflow-y-auto"
                    style={{
                        top: triggerPosPdrbExp.top,
                        left: triggerPosPdrbExp.left,
                        width: triggerPosPdrbExp.width,
                    }}
                    >
                    {optionsPDRBExp.map((opt) => (
                    <li
                        key={opt.value}
                        onClick={() => handleSelectPdrb(opt.value)}
                        className="px-4 py-2 hover:bg-white hover:text-black cursor-pointer"
                    >
                        {opt.label}
                    </li>
                    ))}
                    </ul>,
                    document.body
                )}
            </CardHeader>
            <CardContent>
                <div style={{width:'100%', height:300}}>
                    <ResponsiveContainer height={300}>
                        <AreaChart width={500} height={300} data={dataPdrb} margin={{bottom:25,left:10}}>
                            <defs>
                                <linearGradient id="pdrb" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.97}/>
                                    <stop offset="95%" stopColor="#168ad8ff" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke='#ccc' />
                            <XAxis dataKey='Tahun' style={{fill: "#168ad8ff"}}>
                                <Label value="Tahun" angle={0} position="insideBottom"                                         
                                        dx={0}
                                        dy={25}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#168ad8ff",
                                    }}        
                                />
                            </XAxis>
                            <YAxis style={{fill: "#168ad8ff"}} tickFormatter={kFormatter} tick={{fontSize: 12}}>
                                <Label value="Milyar Rupiah" angle={-90} position="insideLeft" 
                                        dx={-10}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#168ad8ff",
                                    }}        
                                />
                            </YAxis>
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey={selectedPdrbExp}
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#pdrb)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <StatPdrb selectedPdrbExp={selectedPdrbExp} setSelectedPdrbExp={setSelectedPdrbExp}/>
        </div>
        < br/>
    </> 
);
}

export default AnalyticsChart;