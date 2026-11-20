'use client';

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Label} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader,CardTitle} from '@/components/ui/card';
import dataMap from '@/data/jambi_kecamatan.json';
import type {Topology} from 'topojson-specification';
import type { SectorKey } from '@/types/sectorkey';
import type { ExpKey } from '@/types/expkey';
import StatPdrbLu from './StatPdrbLu';
import StatPdrbExp from '@/components/economics/StatPdrb';
import MapStat from "./MapStat";
import TopSectorShareChart from "./TopSectorShareChart";
import { useState } from 'react';
import IndicatorSelect, { type IndicatorOption } from '@/components/IndicatorSelect';
import { useReferenceYear } from '@/components/ReferenceYearContext';
import { useDashboardData } from '@/components/DashboardDataContext';

const optionsPDRB: IndicatorOption[] = [
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

const optionsPDRBExp: IndicatorOption[] = [
    { value: "KonsumsiRumahTangga", label: "Konsumsi Rumah Tangga" },
    { value: "KonsumsiLNPRT", label: "Konsumsi LNPRT" },
    { value: "KonsumsiPemerintah", label: "Konsumsi Pemerintah" },
    { value: "PMTB", label: "Pembentukan Modal Tetap Bruto" },
    { value: "PerubahanInventori", label: "Perubahan Inventori" },
    { value: "Ekspor", label: "Ekspor Barang dan Jasa" },
    { value: "NetEkspor", label: "Net Ekspor" },
];

const pdrbTypeOptions: IndicatorOption[] = [
    { value: "pengeluaran", label: "Pengeluaran" },
    { value: "lapangan-usaha", label: "Lap. Usaha" },
];

const optionsSoceko: IndicatorOption[] = [
    { value: "P0", label: "Persentase Kemiskinan (P0)" },
    { value: "TPT", label: "Tingkat Pengangguran Terbuka (TPT)" },
    { value: "PE", label: "Pertumbuhan Ekonomi (PE)" },
    { value: "Gini", label: "Rasio Gini" },
];

const pdrbTooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid rgba(139, 92, 246, 0.28)",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(76, 29, 149, 0.12)",
};

const socialTooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid rgba(34, 197, 94, 0.28)",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(20, 83, 45, 0.12)",
};

const AnalyticsChart: React.FC = () => {
    const [selectedPdrb, setSelectedPdrb] = useState<SectorKey>('A');
    const [selectedPdrbExp, setSelectedPdrbExp] = useState<ExpKey>('KonsumsiRumahTangga');
    const [selectedPdrbType, setSelectedPdrbType] = useState<"pengeluaran" | "lapangan-usaha">("lapangan-usaha");
    const [selectedSoceko, setSelectedSoceko] = useState("P0");
    const { referenceYear } = useReferenceYear();
    const { pdrbLu: dataPdrbLu, pdrbExp: dataPdrbExp, socioeko: dataSoceko, demografiByYear } = useDashboardData();
    const isLapanganUsaha = selectedPdrbType === "lapangan-usaha";
    const indicatorOptions = isLapanganUsaha ? optionsPDRB : optionsPDRBExp;
    const selectedIndicator = isLapanganUsaha ? selectedPdrb : selectedPdrbExp;
    const selectedIndicatorLabel = indicatorOptions.find((option) => option.value === selectedIndicator)?.label;
    const visiblePdrbData = isLapanganUsaha
        ? dataPdrbLu.filter((item) => item.Tahun <= referenceYear)
        : dataPdrbExp
            .filter((item) => item.Tahun <= referenceYear)
            .map((item) => ({ ...item, [selectedPdrbExp]: item[selectedPdrbExp] / 1000 }));
    const visibleSocekoData = dataSoceko.filter((item) => item.Tahun <= referenceYear);
    const TypedDataMap: Topology = dataMap as unknown as Topology;

    const handlePdrbIndicatorChange = (value: string) => {
        if (isLapanganUsaha) setSelectedPdrb(value as SectorKey);
        else setSelectedPdrbExp(value as ExpKey);
    };

    return ( 
    <>
    <div className='grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)]'>
        <Card className='min-w-0 bg-violet-50 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:bg-violet-950/40 dark:hover:border-violet-700 lg:h-[32rem] xl:h-[30.5rem]'>
            <CardHeader>
                <div className="grid gap-1 rounded-lg border border-violet-100 bg-white/70 p-3 dark:border-violet-900/60 dark:bg-slate-900/60">
                    <div className="min-w-0">
                        <CardTitle className="text-base text-violet-800 dark:text-violet-200">PDRB Kabupaten Merangin (Miliar Rupiah)</CardTitle>
                    </div>
                    <div className="min-w-0">
                        <CardDescription>
                            {isLapanganUsaha ? `Lapangan usaha · ${selectedIndicatorLabel ?? selectedPdrb}` : `Pengeluaran · ${selectedIndicatorLabel ?? selectedPdrbExp}`}
                        </CardDescription>
                    </div>
                </div>
                <div className="grid min-w-0 grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-2">
                    <IndicatorSelect
                        id="jenis-pdrb-ringkasan"
                        label="Pilih jenis PDRB: lapangan usaha atau pengeluaran"
                        value={selectedPdrbType}
                        options={pdrbTypeOptions}
                        onValueChange={(value) => setSelectedPdrbType(value as "pengeluaran" | "lapangan-usaha")}
                        color="lavender"
                        compact
                    />
                    <IndicatorSelect
                        id="indikator-pdrb-ringkasan"
                        label={isLapanganUsaha ? "Pilih sektor lapangan usaha PDRB" : "Pilih komponen PDRB menurut pengeluaran"}
                        value={selectedIndicator}
                        options={indicatorOptions}
                        onValueChange={handlePdrbIndicatorChange}
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
                                        fontSize: "110%",
                                        fill: "#6d28d9",
                                    }}        
                                />
                            </XAxis>
                            <YAxis
                                style={{fill: "#6d28d9"}}
                                tick={{fill: "#6d28d9", fontSize: 12}}
                                axisLine={{stroke: "#8b5cf6", strokeOpacity: 0.45}}
                                tickLine={{stroke: "#8b5cf6", strokeOpacity: 0.45}}
                            >
                                <Label value="Milyar Rupiah" angle={-90} position="insideLeft" 
                                        dx={-5}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "110%",
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
                                dataKey={selectedPdrb}
                                stroke="#7c3aed"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#pdrb)"
                                animationDuration={450}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <div className="grid min-w-0 content-start gap-4 lg:h-[32rem] lg:grid-rows-[17.75rem_minmax(0,1fr)] xl:h-[30.5rem] xl:grid-rows-[14.25rem_minmax(0,1fr)]">
            {isLapanganUsaha ? (
                <StatPdrbLu selectedPdrb={selectedPdrb} referenceYear={referenceYear}/>
            ) : (
                <StatPdrbExp selectedPdrbExp={selectedPdrbExp} referenceYear={referenceYear}/>
            )}
            <TopSectorShareChart referenceYear={referenceYear} />
        </div>
        </div>
        <div className='mt-5 grid min-w-0 grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]'>
            <Card className='h-full min-w-0 bg-emerald-50 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:bg-emerald-950/30 dark:hover:border-emerald-700'>
                <CardHeader>
                    <div className="grid gap-1 rounded-lg border border-emerald-100 bg-white/70 p-3 dark:border-emerald-900/50 dark:bg-slate-900/60">
                        <div className="min-w-0">
                        <CardTitle className="text-base text-emerald-800 dark:text-emerald-200">Indikator Sosial Ekonomi Kabupaten Merangin</CardTitle>
                        </div>
                        <div className="min-w-0">
                            <CardDescription>{selectedSoceko==="P0"?"Persentase Kemiskinan":selectedSoceko==="PE"?"Pertumbuhan Ekonomi":selectedSoceko==="TPT"?"Tingkat Pengangguran Terbuka":selectedSoceko==="Gini"?"Ketimpangan Pendapatan":"-"}</CardDescription>
                        </div>
                    </div>
                    <IndicatorSelect
                        id="indikator-sosial-ekonomi"
                        label="Pilih indikator sosial ekonomi"
                        value={selectedSoceko}
                        options={optionsSoceko}
                        onValueChange={setSelectedSoceko}
                        color="green"
                    />
                </CardHeader>
                <CardContent>
                    <div className="h-[clamp(20rem,32vw,24rem)] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart width={1100} height={300} data={visibleSocekoData} margin={{bottom:20,left:10}}>
                                <defs>
                                    <linearGradient id="socio" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4ade80" stopOpacity={0.82}/>
                                        <stop offset="58%" stopColor="#86efac" stopOpacity={0.38}/>
                                        <stop offset="100%" stopColor="#dcfce7" stopOpacity={0.08}/>
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey='Tahun'
                                    style={{fill: "#047857"}}
                                    tick={{fill: "#047857", fontSize: 12}}
                                    axisLine={{stroke: "#22c55e", strokeOpacity: 0.45}}
                                    tickLine={{stroke: "#22c55e", strokeOpacity: 0.45}}
                                >
                                <Label value="Tahun" angle={0} position="insideBottom"                                         
                                        dx={0}
                                        dy={25}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "110%",
                                        fill: "#047857",
                                    }}        
                                />
                            </XAxis>
                            <YAxis
                                style={{fill: "#047857"}}
                                tick={{fill: "#047857", fontSize: 12}}
                                axisLine={{stroke: "#22c55e", strokeOpacity: 0.45}}
                                tickLine={{stroke: "#22c55e", strokeOpacity: 0.45}}
                            >
                                <Label value="Persen (%)" angle={-90} position="insideLeft" 
                                        dx={-5}
                                        style={{
                                        textAnchor: "middle",
                                        fontSize: "110%",
                                        fill: "#047857",
                                    }}        
                                />
                            </YAxis>
                            <Tooltip
                                contentStyle={socialTooltipStyle}
                                labelStyle={{color: "var(--card-foreground)", fontWeight: 600}}
                                itemStyle={{color: "#047857"}}
                            />
                                <Area
                                    type="monotone"
                                    dataKey={selectedSoceko}
                                    stroke="#16a34a"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#socio)"
                                    animationDuration={450}
                                    animationEasing="ease-out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <div className='h-full min-w-0'>
                <MapStat
                    topojsonData={TypedDataMap}
                    width={100}
                    height={100}
                    demografiData={demografiByYear.get(referenceYear)}
                    dataYear={referenceYear}
                />
            </div>
        </div>
    </> 
);
}

export default AnalyticsChart;
