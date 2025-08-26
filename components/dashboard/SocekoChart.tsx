'use client';

import { AreaChart, LineChart, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Label} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader,CardTitle} from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import dataSoceko from '@/data/socioeko';

interface Props {
    selectedSoceko: string;
    setSelectedSoceko: (value: string) => void;
}

const SocekoChart: React.FC<Props> = ({selectedSoceko,setSelectedSoceko}) => {

    const katSoceko = selectedSoceko===""? "TPT":selectedSoceko;
    const optionsSoceko = [
        {value:"P0",label:"Persentase Kemiskinan"},
        {value:"TPT",label:"Tingkat Pengangguran Terbuka"},
        {value:"PE",label:"Pertumbuhan Ekonomi"},
        {value:"Gini",label:"Ketimpangan Pendapatan (Rasio gini)"}
    ];
    
    return ( 
    <>
    <div className='grid grid-cols-4 grid-rows-1 justify-between gap-5'>
        < br/>
        <Card className='relative w-full col-span-2 col-start-1'>
            <CardHeader>
                <CardTitle>Indikator Sosial Ekonomi Kabupaten Merangin</CardTitle>
                <CardDescription>{katSoceko==="P0"?"Persentase Kemiskinan (%)":katSoceko==="PE"?"Pertumbuhan Ekonomi (%)":katSoceko==="Gini"?"Ketimpangan Pendapatan (%)":"-"}</CardDescription>
                <Select value={selectedSoceko} onValueChange={setSelectedSoceko}>
                        <SelectTrigger className="w-full z-1000 text-white bg-black text-1xl border border-white hover:bg-zinc-800 rounded-sm px-2 py-2">
                            {!selectedSoceko && (
                                <span className="before:content-['Pilih_Indikator'] before:text-white"
                                ></span>
                            )}
                            {optionsSoceko.find(opt => opt.value === selectedSoceko)?.label||"Pilih"}
                        </SelectTrigger>
                    <SelectContent className='absolute top-10 left-25 z-1000 w-full border border-zinc border border-white rounded-md'>
                        <SelectGroup>
                            {optionsSoceko.map((option) => (
                            <SelectItem key={option.label} value={option.value.toString()} className='z-1000 bg-black text-white focus:bg-white focus:text-black focus:border-white focus:rounded-[2px]'>
                                {option.label}
                            </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div style={{width:'100%', height:300}} className='z-1'>
                    <ResponsiveContainer className='z-10'>
                        <AreaChart className='z-10' width={1100} height={300} data={dataSoceko}>
                            <defs>
                                <linearGradient id="socio" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.97}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke='#ccc' />
                            <XAxis dataKey='Tahun' />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey={katSoceko} stroke="#82ca9d" fillOpacity={1} fill="url(#socio)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    </div>
    </> 
);
}

export default SocekoChart;