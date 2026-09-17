import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { MonthProjection } from '../types';

interface FinancialChartsProps {
  projections: MonthProjection[];
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ projections }) => {
  const data = projections.map(p => ({
    name: `M${p.month}`,
    Revenue: p.revenue,
    Expenses: p.expenses,
    Profit: p.net_profit,
    CashAccumulated: p.cumulative_cash
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Revenue vs Expenses vs Profit */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">12-Month Profitability Forecast (₹)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Cumulative Cash Flow Trajectory */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Cumulative Cash Flow & Payback Trajectory (₹)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Cumulative Cash']}
              />
              <Area type="monotone" dataKey="CashAccumulated" stroke="#10b981" fillOpacity={1} fill="url(#colorCash)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
