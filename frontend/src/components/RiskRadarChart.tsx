import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface RiskRadarChartProps {
  categories: Record<string, number>;
}

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ categories }) => {
  const data = Object.entries(categories).map(([key, val]) => ({
    subject: key.replace(" Risk", ""),
    score: val,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            formatter={(value: any) => [`${value} / 100`, 'Risk Level']}
          />
          <Radar
            name="Risk Score"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
