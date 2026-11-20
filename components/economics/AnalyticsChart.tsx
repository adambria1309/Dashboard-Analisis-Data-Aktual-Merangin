'use client';

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Label} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader,CardTitle} from '@/components/ui/card';
import type { ExpKey } from '@/types/expkey';
import type { SectorKey } from '@/types/sectorkey';
import StatPdrb from './StatPdrb';
import StatPdrbLu from '@/components/summary/StatPdrbLu';
import { useState } from 'react';
import IndicatorSelect, { type IndicatorOption } from '@/components/IndicatorSelect';
import { useReferenceYear } from '@/components/ReferenceYearContext';
import { useDashboardData } from '@/components/DashboardDataContext';
import LaborAnalytics from './LaborAnalytics';
import PdrbBreakdownChart from './PdrbBreakdownChart';

const optionsPDRBExp: IndicatorOption[] = [
    { value: "KonsumsiRumahTangga", label: "Konsumsi Rumah Tangga" },
    { value: "KonsumsiLNPRT", label: "Konsumsi Lembaga Non Profit Rumah Tangga" },
    { value: "KonsumsiPemerintah", label: "Konsumsi Pemerintah" },
    { value: "PMTB", label: "Pembentukan Modal Tetap Bruto" },
    { value: "PerubahanInventori", label: "Perubahan Inventori" },
    { value: "Ekspor", label: "Ekspor Barang dan Jasa" },
    { value: "NetEkspor", label: "Net Ekspor" },
];

const optionsPDRBLu: IndicatorOption[] = [
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
    { value: "RSTU", label: "Jasa Lainnya (RSTU)" },
];

const pdrbTypeOptions: IndicatorOption[] = [
    { value: "pengeluaran", label: "Pengeluaran" },
    { value: "lapangan-usaha", label: "Lap. Usaha" },
];

const pdrbTooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid rgba(139, 92, 246, 0.28)",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(76, 29, 149, 0.12)",
};

const AnalyticsChart: React.FC = () => {

    const [selectedPdrbType, setSelectedPdrbType] = useState<"pengeluaran" | "lapangan-usaha">("pengeluaran");
    const [selectedPdrbExp, setSelectedPdrbExp] = useState<ExpKey>('KonsumsiRumahTangga');
    const [selectedPdrbLu, setSelectedPdrbLu] = useState<SectorKey>('A');
    const { referenceYear } = useReferenceYear();
    const { pdrbExp: dataPdrbExp, pdrbLu: dataPdrbLu } = useDashboardData();
    const isLapanganUsaha = selectedPdrbType === "lapangan-usaha";
    const selectedIndicator = isLapanganUsaha ? selectedPdrbLu : selectedPdrbExp;
    const indicatorOptions = isLapanganUsaha ? optionsPDRBLu : optionsPDRBExp;
    const visiblePdrbData = (isLapanganUsaha ? dataPdrbLu : dataPdrbExp)
      .filter((item) => item.Tahun <= referenceYear);

    const handleIndicatorChange = (value: string) => {
      if (isLapanganUsaha) setSelectedPdrbLu(value as SectorKey);
      else setSelectedPdrbExp(value as ExpKey);
    };
    // Function to format large numbers (e.g., 10000 -> 10k)
    const kFormatter = (num:number) => {
    return Math.abs(num) > 999 ? ((Math.abs(num) / 1000)).toString() + "RB" : (num * Math.abs(num)).toString();
    };

    return ( 
    <>
    <div className='grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)]'>
        <Card className='min-w-0 bg-violet-50 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:bg-violet-950/40 dark:hover:border-violet-700'>
            <CardHeader>
                <div className="grid gap-1 rounded-lg border border-violet-100 bg-white/70 p-3 dark:border-violet-900/60 dark:bg-slate-900/60">
                    <div className="min-w-0">
                        <CardTitle className="text-base text-violet-800 dark:text-violet-200">PDRB Kabupaten Merangin (Miliar Rupiah)</CardTitle>
                    </div>
                    <div className="min-w-0">
                        {/* <CardDescription>{namaExp}</CardDescription> */}
                        <CardDescription>PDRB Kabupaten Merangin Menurut {isLapanganUsaha ? "Lapangan Usaha" : "Pengeluaran"}</CardDescription>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-2">
                    <IndicatorSelect
                        id="jenis-pdrb-ekonomi"
                        label="Pilih jenis PDRB: lapangan usaha atau pengeluaran"
                        value={selectedPdrbType}
                        options={pdrbTypeOptions}
                        onValueChange={(value) => setSelectedPdrbType(value as "pengeluaran" | "lapangan-usaha")}
                        color="lavender"
                        compact
                    />
                    <IndicatorSelect
                        id="indikator-pdrb-ekonomi"
                        label={isLapanganUsaha ? "Pilih sektor lapangan usaha PDRB" : "Pilih komponen PDRB menurut pengeluaran"}
                        value={selectedIndicator}
                        options={indicatorOptions}
                        onValueChange={handleIndicatorChange}
                        color="lavender"
                        compact
                    />
                </div>
            </CardHeader>
            <CardContent>
                    <div className="h-[18rem] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart width={500} height={300} data={visiblePdrbData} margin={{bottom:25,left:10}}>
                            <defs>
                                <linearGradient id="pdrb" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.82}/>
                                    <stop offset="58%" stopColor="#c4b5fd" stopOpacity={0.4}/>
                                    <stop offset="100%" stopColor="#ede9fe" stopOpacity={0.08}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey='Tahun'
                                style={{fill: "#6d28d9"}}
                                tick={{fill: "#6d28d9", fontSize: 12}}
                                axisLine={{stroke: "#8b5cf6", strokeOpacity: 0.45}}
                                tickLine={{stroke: "#8b5cf6", strokeOpacity: 0.45}}
                            >
                                <Label value="Tahun" angle={0} position="insideBottom"                                         
                                        dx={0}
                                        dy={25}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#6d28d9",
                                    }}        
                                />
                            </XAxis>
                            <YAxis
                                style={{fill: "#6d28d9"}}
                                tickFormatter={kFormatter}
                                tick={{fill: "#6d28d9", fontSize: 12}}
                                axisLine={{stroke: "#8b5cf6", strokeOpacity: 0.45}}
                                tickLine={{stroke: "#8b5cf6", strokeOpacity: 0.45}}
                            >
                                <Label value="Milyar Rupiah" angle={-90} position="insideLeft" 
                                        dx={-10}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "#6d28d9",
                                    }}        
                                />
                            </YAxis>
                            <Tooltip
                                contentStyle={pdrbTooltipStyle}
                                labelStyle={{color: "var(--card-foreground)", fontWeight: 600}}
                                itemStyle={{color: "#6d28d9"}}
                            />
                            <Area
                                type="monotone"
                                dataKey={selectedIndicator}
                                stroke="#7c3aed"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#pdrb)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <div className="grid min-w-0 content-start gap-4">
            {isLapanganUsaha ? (
                <StatPdrbLu selectedPdrb={selectedPdrbLu} referenceYear={referenceYear}/>
            ) : (
                <StatPdrb selectedPdrbExp={selectedPdrbExp} referenceYear={referenceYear}/>
            )}
            <PdrbBreakdownChart pdrbType={selectedPdrbType} referenceYear={referenceYear} />
        </div>
        </div>
        <LaborAnalytics />
    </> 
);
}

export default AnalyticsChart;
