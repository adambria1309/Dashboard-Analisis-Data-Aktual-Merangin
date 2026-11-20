import { useState, useEffect, useRef } from "react";
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import { select, geoPath, geoMercator, scaleSequential, interpolateRgb } from "d3";
import type { Topology } from "topojson-specification";
import type { DemographyYearItem } from "@/types/dashboard-data";

interface DataMapProps {
  topojsonData: Topology;
  width?: number;
  height?: number;
  variable?: string;
  mainColor?: string;  
  endColor?: string; 
  demografiData?: DemographyYearItem[];
  dataYear?: number;
}

const variableOptions = [
  { label: "Jumlah Penduduk (Jiwa)", value: "Jumlah_Pen" },
  { label: "Laju Pertumbuhan (%)", value: "Laju_Pertu" },
  { label: "Persentase Penduduk (%)", value: "Persentase" },
  { label: "Kepadatan Penduduk (Jiwa/KM²)", value: "Kepadata_" },
  { label: "Rasio Jenis Kelamin (%)", value: "Rasio_Jeni" },
];

const MapStat: React.FC<DataMapProps> = ({ 
        topojsonData, 
        width = 1200, 
        height = 1200,mainColor = '#c7f0c4',  // default: light green
        endColor = '#086d36',
        demografiData,
        dataYear = 2019,
    }) => {
    const hasDataForYear = dataYear === 2019 || Boolean(demografiData?.length);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const legendRef = useRef<HTMLDivElement | null>(null);
    const [selectedVariable, setSelectedVariable] = useState<string>("Jumlah_Pen");

    useEffect(() => {
        if (!topojsonData || !topojsonData.objects) return;

        const svg = select(svgRef.current);
        svg.selectAll('*').remove();
        if (legendRef.current) legendRef.current.innerHTML = '';
        if (!hasDataForYear) return;

        const geojson = feature(
        topojsonData,
        topojsonData.objects[Object.keys(topojsonData.objects)[0]]
        ) as FeatureCollection;

        if (demografiData?.length) {
          const valuesByDistrict = new Map(
            demografiData.map((row) => [row.Kecamatan.trim().replace(/\s+/g, " ").toLocaleUpperCase("id-ID"), row]),
          );
          for (const mapFeature of geojson.features) {
            const properties = mapFeature.properties;
            const name = properties?.nmkec;
            if (typeof name !== "string") continue;
            const row = valuesByDistrict.get(name.trim().replace(/\s+/g, " ").toLocaleUpperCase("id-ID"));
            if (!row || !properties) continue;
            Object.assign(properties, {
              Jumlah_Pen: row.Jumlah_Pen,
              Laju_Pertu: row.Laju_Pertu,
              Persentase: row.Persentase,
              Kepadata_: row.Kepadata_,
              Rasio_Jeni: row.Rasio_Jeni,
              periode: String(dataYear),
            });
          }
        }

        const values = geojson.features.map(f => (f.properties?.[selectedVariable] as number) ?? 0);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        const projection = geoMercator().fitSize([width, height], geojson);
        const path = geoPath().projection(projection);
        const color = scaleSequential(
            interpolateRgb(mainColor, endColor)
        ).domain([minValue, maxValue]);

        const paths = svg
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', path as any)
            .attr('fill', d => color((d.properties?.[selectedVariable] as number) ?? 0))
            .attr('stroke', '#000')
            .attr('stroke-width', 0.2);
        
    paths.on('mouseover', function (event, d) {
        const tooltip = tooltipRef.current;
        if (tooltip && containerRef.current) {
          tooltip.style.opacity = '1';
          tooltip.innerHTML = `
            <strong>${d.properties?.nmkec}</strong><br />
            ${variableOptions.find(opt => opt.value === selectedVariable)?.label}: ${d.properties?.[selectedVariable] ?? 'N/A'}
          `;
        }
        select(this).attr('fill', 'orange');
      })
      .on('mousemove', function (event) {
        const tooltip = tooltipRef.current;
        const container = containerRef.current;
        if (tooltip && container) {
            const bounds = container.getBoundingClientRect();
          tooltip.style.left = `${event.clientX - bounds.left + 10}px`;
          tooltip.style.top = `${event.clientY - bounds.top + 10}px`;
        }
      })
      .on('mouseout', function (event, d) {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.opacity = '0';
        }
        select(this).attr('fill', color((d.properties?.[selectedVariable] as number) ?? 0));
      });

      // Horizontal legend
        const legend = legendRef.current;
        if (legend) {
        legend.innerHTML = '';
        const steps = 5;
        const step = (maxValue - minValue) / (steps - 1);
        const labels = Array.from({ length: steps }, (_, i) => minValue + i * step);

        const legendRow = document.createElement('div');
        legendRow.className = 'flex space-x-3';

        labels.forEach(val => {
            const item = document.createElement('div');
            item.className = 'flex flex-col items-center text-white text-xs';

            const box = document.createElement('div');
            box.className = 'w-5 h-5 rounded';
            box.style.backgroundColor = color(val);

            const label = document.createElement('span');
            label.textContent = val.toFixed(1);

            item.appendChild(box);
            item.appendChild(label);
            legendRow.appendChild(item);
        });

        legend.appendChild(legendRow);
        }
    }, [topojsonData, width, height, selectedVariable, mainColor, endColor, demografiData, dataYear, hasDataForYear]);


  return (
    <>  
        <div id="demografi" ref={containerRef} className="relative flex h-full min-w-0 flex-col gap-3 rounded-xl border border-blue-200 bg-emerald-50 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:bg-blue-950 dark:hover:border-emerald-700">
        <div className="rounded-lg border border-blue-100 bg-white/70 p-3 dark:bg-blue-900/70">
            <h2 className="text-center font-semibold text-emerald-800 dark:text-blue-100">
                Demografi dan Kependudukan
            </h2>
            <p className="mt-1 text-center text-xs text-muted-foreground">
                Data peta kecamatan · {dataYear}
            </p>
        </div>
        <div className="grid gap-1">
            <label htmlFor="variable-select" className="text-sm font-medium text-emerald-900 dark:text-blue-100">
                Pilih indikator
            </label>
            <select
            id="variable-select"
            aria-label="Pilih indikator kependudukan"
            className="min-h-11 w-full min-w-0 rounded-md border border-emerald-700 bg-emerald-700 px-3 py-2 text-sm font-medium text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            value={selectedVariable}
            disabled={!hasDataForYear}
            onChange={(e) => setSelectedVariable(e.target.value)}
            >
            {variableOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            </select>
        </div>
        {hasDataForYear ? (
            <>
                <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="h-[clamp(18rem,28vw,20rem)] w-full shrink-0"/>
                <div
                    ref={tooltipRef}
                    className="pointer-events-none absolute z-10 rounded bg-black p-2 text-sm text-white opacity-0 transition-opacity duration-200"
                    style={{left:0, top:0}}
                />
                <div
                    ref={legendRef}
                    className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-gray-800/85 p-2 shadow-sm"
                />
            </>
        ) : (
            <div
                role="status"
                className="flex h-[clamp(18rem,28vw,20rem)] items-center justify-center rounded-lg border border-dashed border-emerald-300 bg-white/60 px-5 text-center text-sm leading-6 text-emerald-900 dark:border-emerald-800 dark:bg-slate-900/40 dark:text-emerald-100"
            >
                Data demografi kecamatan tahun {dataYear} belum tersedia. Unggah data kecamatan untuk tahun ini agar peta dapat ditampilkan.
            </div>
        )}
        </div>
    </>
  );
};

export default MapStat;
