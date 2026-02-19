import { useState, useEffect, useRef } from "react";
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import { select, geoPath, geoMercator, scaleSequential, interpolateRgb } from "d3";
import type { Topology } from "topojson-specification";

interface DataMapProps {
  topojsonData: Topology;
  width?: number;
  height?: number;
  variable?: string;
  mainColor?: string;  
  endColor?: string; 
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
        endColor = '#086d36'
    }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const legendRef = useRef<HTMLDivElement | null>(null);
    const [selectedVariable, setSelectedVariable] = useState<string>("Jumlah_Pen");

    useEffect(() => {
        if (!topojsonData || !topojsonData.objects) return;

        const svg = select(svgRef.current);
        svg.selectAll('*').remove();

        const geojson = feature(
        topojsonData,
        topojsonData.objects[Object.keys(topojsonData.objects)[0]]
        ) as FeatureCollection;

        const values = geojson.features.map(f => (f.properties?.[selectedVariable] as number) ?? 0);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        const projection = geoMercator().fitSize([width, 0.7*height], geojson);
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
    }, [topojsonData, width, height, selectedVariable]);


  return (
    <>  
        <div ref={containerRef} className="grid grid-col-1 grid-row-[10%,90%] gap-y-1 w-full h-[75vh] bg-emerald-100/20 backdrop-filter backdrop-blur-md border-2 border-blue-100 dark:bg-blue-800 rounded-md">
        <div className="flex justify-center items-center ">
            <div className='w-[95%] h-[10vh] pb-0 grid grid-row-2 grid-col-1 gap-y-0 bg-white/50 backdrop-filter backdrop-blur-md border-2 border-blue-100 rounded-md mt-[2%]'>
                <div className=''>
                    <h2 className="text-center font-bold text-[#0ea849ff] dark:text-blue-200">
                        Demografi
                    </h2>
                </div>
                <div className='flex justify-center items-center'>
                    <hr className='w-[95%] h-1 border-[#0ea849ff] dark:border-white'/>
                </div>
                <div className=''>
                    <h2 className="text-center font-bold text-[#0ea849ff] dark:text-blue-200">
                        Kependudukan
                    </h2>
                </div>
            </div>
        </div>
        <div className="p-2">
            <select
            id="variable-select"
            className="w-full p-2 rounded bg-[#0ea849ff] text-white font-semibold border mt-[-5%]"
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
            >
            {variableOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            </select>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-[110%] mt-[2%]"/>
        <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-200"
            style={{left:0, top:0}}
        />
        <div
            ref={legendRef}
            className="absolute bottom-2 left-5 bg-gray-600/80 p-2 rounded space-y-1"
        />
        </div>
    </>
  );
};

export default MapStat;