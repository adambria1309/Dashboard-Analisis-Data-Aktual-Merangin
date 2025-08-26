'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Label} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader,CardTitle} from '@/components/ui/card';
import dataPdrb from '@/data/pdrb';
import dataSoceko from '@/data/socioeko';
import dataMap from '@/data/jambi_kecamatan.json';
import type {Topology} from 'topojson-specification';
import { sectorKeys, SectorKey } from '@/types/sectorkey';
import StatPdrb from './StatPdrb';
import MapStat from "./MapStat";
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
    const optionsPDRB = [
        { value: "A", label: "Pertanian, Kehutanan, dan Perikanan (A)" },
        { value: "B", label: "Pertambangan dan Penggalian (B)" },
        { value: "C", label: "Industri Pengolahan (C)" },
        { value: "D", label: "Pengadaan Listrik dan Gas (D)" },
        { value: "E", label: "Pengadaan Air, Pengelolaan Sampah, Limbah, dan Daur Ulang (E)" },
        { value: "F", label: "Konstruksi (F)" },
        { value: "G", label: "Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor (G)" },
        { value: "H", label: "Transportasi dan Pergudangan (H)" },
        { value: "I", label: "Penyediaan Akomodasi dan Makan Minum (I)" },
        { value: "J", label: "Informasi dan Komunikasi (J)" },
        { value: "K", label: "Jasa Keuangan dan Asuransi (K)" },
        { value: "L", label: "Real Estat (L)" },
        { value: "MN", label: "Jasa Perusahaan (MN)" },
        { value: "O", label: "Administrasi Pemerintahan, Pertahanan, dan Jaminan Sosial Wajib (O)" },
        { value: "P", label: "Jasa Pendidikan (P)" },
        { value: "Q", label: "Jasa Kesehatan dan Kegiatan Sosial (Q)" },
        { value: "RSTU", label: "Jasa Lainnya (RSTU)" }
        ];
    const [selectedPdrb, setSelectedPdrb] = useState<SectorKey>('A');
      
    const [isOpenPdrb, setIsOpenPdrb] = useState(false);
    const [triggerPosPdrb, setTriggerPosPdrb] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
    const triggerRefPdrb = useRef<HTMLDivElement>(null);
    const dropdownRefPdrb = useRef<HTMLUListElement>(null);
    
    const toggleDropdownPdrb = () => {setIsOpenPdrb((prev) => !prev);};
    const handleSelectPdrb = (value: string) => {
        setSelectedPdrb(value as SectorKey);
        setIsOpenPdrb(false);
    };

    useEffect(() => {
        if (isOpenPdrb && triggerRefPdrb.current) {
            const rect = triggerRefPdrb.current.getBoundingClientRect();
            setTriggerPosPdrb({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [isOpenPdrb]);
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target=e.target as Node;
            if (!triggerRefPdrb.current?.contains(target) &&
            !dropdownRefPdrb.current?.contains(target)) {
                setIsOpenPdrb(false);
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
    
    //untuk map
    const svgRef = useRef<SVGSVGElement>(null);
    const TypedDataMap: Topology = dataMap as unknown as Topology;

    return ( 
    <>
    <div className='mt-[-3%] grid grid-cols-5 grid-rows-1 gap-5'>
        <Card className='w-full col-span-3 col-start-1 bg-blue-50/60 backdrop-filter backdrop-blur-md'>
            <CardHeader>
                <div className='grid grid-col-1 grid-row-2 gap-y-2 bg-white/50 backdrop-filter backdrop-blur-md border-1 border-blue-100 rounded-md mt-[-2.5%]'>
                    <div className='ml-[1%] mt-[1%]'>
                        <CardTitle className='text-[#168ad8ff]'>PDRB Kabupaten Merangin (Milyar Rupiah)</CardTitle>
                    </div>
                    <div className='ml-[1%] mb-[1%]'>
                        <CardDescription>Sektor {selectedPdrb}</CardDescription>
                    </div>
                </div>
                <div
                    ref={triggerRefPdrb}
                    onClick={toggleDropdownPdrb}
                    className="w-full p-2 border border-white bg-[#168ad8ff] text-white cursor-pointer select-none rounded  flex justify-between items-center"
                >
                    <span> {optionsPDRB.find(opt => opt.value === selectedPdrb)?.label || 'Pilih Kategori PDRB'} </span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                {isOpenPdrb && createPortal(
                    <ul
                    ref={dropdownRefPdrb}
                    className="absolute z-50 bg-[#168ad8ff] text-white border border-white rounded shadow-md max-h-50 overflow-y-auto"
                    style={{
                        top: triggerPosPdrb.top,
                        left: triggerPosPdrb.left,
                        width: triggerPosPdrb.width,
                    }}
                    >
                    {optionsPDRB.map((opt) => (
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
                                        fontSize: "110%",
                                        fill: "#168ad8ff",
                                    }}        
                                />
                            </XAxis>
                            <YAxis style={{fill: "#168ad8ff"}}>
                                <Label value="Milyar Rupiah" angle={-90} position="insideLeft" 
                                        dx={-5}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "110%",
                                        fill: "#168ad8ff",
                                    }}        
                                />
                            </YAxis>
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey={selectedPdrb}
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#pdrb)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <StatPdrb selectedPdrb={selectedPdrb} setSelectedPdrb={setSelectedPdrb}/>
        </div>
        < br/>
        <div className='grid grid-cols-5 grid-rows-1 gap-5 mt-[-1%]'>
            <Card className='w-full col-span-3 col-start-1 bg-blue-50/60 backdrop-filter backdrop-blur-md'>
                <CardHeader>
                    <div className='grid grid-col-1 grid-row-2 gap-y-2 bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md mt-[-2.5%]'>
                        <div className='ml-[1%] mt-[1%]'>
                            <CardTitle className='text-[#0ea849ff]'>Indikator Sosial Ekonomi Kabupaten Merangin</CardTitle>
                        </div>
                        <div className='ml-[1%] mb-[1%]'>
                            <CardDescription>{selectedSoceko==="P0"?"Persentase Kemiskinan":selectedSoceko==="PE"?"Pertumbuhan Ekonomi":selectedSoceko==="TPT"?"Tingkat Pengangguran Terbuka":selectedSoceko==="Gini"?"Ketimpangan Pendapatan":"-"}</CardDescription>
                        </div>
                    </div>
                    <div
                        ref={triggerRefSoceko}
                        onClick={toggleDropdownSoceko}
                        className="w-full p-2 border border-white bg-[#0ea849ff] text-white cursor-pointer select-none rounded flex justify-between items-center"
                    >
                        <span>{selectedSoceko || 'Pilih Indikator Sosial Ekonomi'}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    {isOpenSoceko && createPortal(
                        <ul
                        ref={dropdownRefSoceko}
                        className="z-100 absolute bg-[#0ea849ff] text-white border border-white rounded shadow-md max-h-30 overflow-y-auto"
                        style={{
                            top: triggerPosSoceko.top,
                            left: triggerPosSoceko.left,
                            width: triggerPosSoceko.width,
                        }}
                        >
                        {optionsSoceko.map((option) => (
                            <li
                            key={option}
                            onClick={() => handleSelectSoceko(option)}
                            className="px-4 py-2 hover:bg-white hover:text-black cursor-pointer"
                            >
                            {option}
                            </li>
                        ))}
                        </ul>, document.body
                    )}
                </CardHeader>
                <CardContent>
                    <div style={{width:'100%', height:300}}>
                        <ResponsiveContainer height={300}>
                            <AreaChart width={1100} height={300} data={dataSoceko} margin={{bottom:20,left:10}}>
                                <defs>
                                    <linearGradient id="socio" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.97}/>
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke='#ccc' />
                                <XAxis dataKey='Tahun' style={{fill: "#0ea849ff"}}>
                                <Label value="Tahun" angle={0} position="insideBottom"                                         
                                        dx={0}
                                        dy={25}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "110%",
                                        fill: "#0ea849ff",
                                    }}        
                                />
                            </XAxis>
                            <YAxis style={{fill: "#0ea849ff"}}>
                                <Label value="Persen (%)" angle={-90} position="insideLeft" 
                                        dx={-5}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "110%",
                                        fill: "#0ea849ff",
                                    }}        
                                />
                            </YAxis>
                            <Tooltip />
                                <Area type="monotone" dataKey={selectedSoceko} stroke="#82ca9d" fillOpacity={1} fill="url(#socio)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <div className='col-span-2 col-start-4'>
                <MapStat topojsonData={TypedDataMap} width={100} height={100}/>
            </div>
        </div>
    </> 
);
}

export default AnalyticsChart;