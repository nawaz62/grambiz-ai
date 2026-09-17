import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { DistrictMarketIntelligence } from '../types';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

// Fix leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MarketMapProps {
  intel: DistrictMarketIntelligence;
}

export const MarketMap: React.FC<MarketMapProps> = ({ intel }) => {
  // Lucknow coordinates baseline: [26.8467, 80.9462]
  const position: [number, number] = [26.8467, 80.9462];

  return (
    <div className="space-y-4">
      <div className="h-80 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-10">
        <MapContainer center={position} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="p-2 text-slate-900">
                <h4 className="font-bold text-sm">{intel.district}, {intel.state}</h4>
                <p className="text-xs">Category: <strong>{intel.business_category}</strong></p>
                <p className="text-xs">Opportunity Score: <strong className="text-emerald-700">{intel.opportunity_score}/100</strong></p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase">Demand Indicator</h5>
          </div>
          <p className="text-sm font-semibold text-white">{intel.demand_indicator}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-sky-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase">Input Availability</h5>
          </div>
          <p className="text-sm font-semibold text-white">{intel.input_availability}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase">Competition Level</h5>
          </div>
          <p className="text-sm font-semibold text-white">{intel.competition_level}</p>
        </div>
      </div>
    </div>
  );
};
