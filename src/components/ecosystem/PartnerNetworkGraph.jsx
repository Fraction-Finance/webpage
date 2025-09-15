import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Users } from 'lucide-react';
const PartnerNetworkGraph = () => {
  const [partners, setPartners] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('ecosystem_partners').select('logo_url, name, category').limit(15);
      if (error) {
        console.error('Error fetching partners for graph:', error);
      } else {
        setPartners(data);
      }
      setLoading(false);
    };
    fetchPartners();
  }, []);
  const categories = useMemo(() => [{
    name: 'Instituciones Financieras',
    angle: 45
  }, {
    name: 'Socios Tecnológicos',
    angle: 135
  }, {
    name: 'Regulación y Cumplimiento',
    angle: 225
  }, {
    name: 'Originadores de Activos',
    angle: 315
  }], []);
  const graphRadius = 160;
  const categoryRadius = 100;
  useEffect(() => {
    if (partners.length > 0) {
      const calculatePositions = () => {
        const center = {
          x: 0,
          y: 0
        };
        let newPositions = [];
        const categoryPositions = categories.map(cat => {
          const angleRad = cat.angle * Math.PI / 180;
          return {
            x: center.x + graphRadius * Math.cos(angleRad),
            y: center.y + graphRadius * Math.sin(angleRad),
            name: cat.name
          };
        });
        newPositions = [...categoryPositions];
        partners.forEach(partner => {
          const categoryInfo = categories.find(c => c.name === partner.category);
          const categoryPos = categoryPositions.find(p => p.name === partner.category);
          if (categoryPos) {
            const angle = Math.random() * 2 * Math.PI;
            const randomRadius = categoryRadius * (0.5 + Math.random() * 0.5);
            newPositions.push({
              x: categoryPos.x + randomRadius * Math.cos(angle),
              y: categoryPos.y + randomRadius * Math.sin(angle),
              logo: partner.logo_url,
              name: partner.name,
              isPartner: true,
              categoryAngle: categoryInfo.angle
            });
          }
        });
        setPositions(newPositions);
      };
      calculatePositions();
    }
  }, [partners, categories]);
  const Line = ({
    from,
    to
  }) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
    const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    return <motion.div initial={{
      scaleX: 0
    }} animate={{
      scaleX: 1
    }} transition={{
      duration: 0.8,
      delay: 0.5
    }} className="absolute h-[1px] bg-gray-300/70 origin-left" style={{
      width: `${length}px`,
      top: `${from.y}px`,
      left: `${from.x}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'left center'
    }} />;
  };
  if (loading) return null;
  return <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center relative">
          <motion.div className="relative" initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 1
    }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: `${graphRadius * 2.5}px`,
        height: `${graphRadius * 2.5}px`
      }}>
              {positions.filter(p => p.isPartner).map((pos, i) => {
          const categoryPos = positions.find(p => p.name === partners[i]?.category);
          if (!categoryPos) return null;
          return <Line key={`line-partner-${i}`} from={{
            x: pos.x,
            y: pos.y
          }} to={{
            x: categoryPos.x,
            y: categoryPos.y
          }} />;
        })}
               {categories.map((cat, i) => {
          const categoryPos = positions.find(p => p.name === cat.name);
          if (!categoryPos) return null;
          return <Line key={`line-cat-${i}`} from={{
            x: 0,
            y: 0
          }} to={categoryPos} />;
        })}
            </div>

            <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 bg-primary/10 rounded-full flex flex-col items-center justify-center text-primary shadow-lg glass-effect" whileHover={{
        scale: 1.1
      }}>
              <Users className="w-8 h-8" />
              <span className="text-sm font-bold mt-1">Fraction</span>
            </motion.div>

            {positions.map((pos, i) => <motion.div key={i} className="absolute top-1/2 left-1/2" initial={{
        x: 0,
        y: 0,
        opacity: 0
      }} animate={{
        x: pos.x,
        y: pos.y,
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2 + i * 0.05
      }}>
                {pos.isPartner ? <motion.div className="w-12 h-12 rounded-full bg-white/80 glass-effect p-1 shadow-md flex items-center justify-center" whileHover={{
          scale: 1.2,
          zIndex: 20
        }} animate={{
          x: [0, Math.cos((pos.categoryAngle + 90) * Math.PI / 180) * 5, 0],
          y: [0, Math.sin((pos.categoryAngle + 90) * Math.PI / 180) * 5, 0]
        }} transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "mirror"
        }}>
                     <img src={pos.logo} alt={pos.name} className="w-full h-full object-contain rounded-full" />
                   </motion.div> : <div className="w-28 h-12 rounded-lg bg-white/80 glass-effect shadow-md flex items-center justify-center text-center p-1">
                    <span className="text-xs font-semibold text-gray-700">{pos.name}</span>
                  </div>}
              </motion.div>)}
          </motion.div>
        </div>;
};
export default PartnerNetworkGraph;