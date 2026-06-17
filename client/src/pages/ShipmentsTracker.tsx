import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Box, Cylinder, Plane, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin, Thermometer, Anchor, Calendar, FileText, CheckCircle2 } from 'lucide-react';

// --- Custom 3D Shapes ---

// Looks like a warehouse with a sloped roof
function WarehouseShape({ color, isActive }: { color: string, isActive: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (isActive && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.6, 0]}>
      {/* Base */}
      <Box args={[1.5, 1.2, 1.5]}>
        <meshStandardMaterial color={color} />
        <Edges scale={1.01} threshold={15} color={isActive ? '#ffffff' : '#000000'} />
      </Box>
      {/* Roof */}
      <Box args={[1.7, 0.4, 1.7]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={isActive ? '#3B82F6' : '#94A3B8'} />
      </Box>
    </group>
  );
}

// Looks like a cargo ship
function CargoShipShape({ color, isActive }: { color: string, isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (isActive && groupRef.current) {
      // Bobbing in water effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Hull */}
      <Box args={[3, 0.8, 1.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} />
        <Edges scale={1.01} color={isActive ? '#ffffff' : '#000000'} />
      </Box>
      {/* Cabin */}
      <Box args={[0.8, 0.8, 1.0]} position={[-0.8, 0.8, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      {/* Containers on deck */}
      <Box args={[1.5, 0.6, 0.8]} position={[0.5, 0.7, 0]}>
        <meshStandardMaterial color={isActive ? '#1E5EFF' : '#94A3B8'} />
      </Box>
    </group>
  );
}

// Looks like a shipping container
function ContainerShape({ color, isActive }: { color: string, isActive: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (isActive && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      <Box args={[1.8, 0.9, 0.9]}>
        <meshStandardMaterial color={color} roughness={0.7} />
        <Edges scale={1.01} threshold={15} color={isActive ? '#ffffff' : '#000000'} />
      </Box>
    </group>
  );
}

// Looks like a farm / silo
function FarmShape({ color, isActive }: { color: string, isActive: boolean }) {
  return (
    <group position={[0, 0.6, 0]}>
      <Cylinder args={[0.8, 0.8, 1.2, 16]}>
        <meshStandardMaterial color={color} />
        <Edges scale={1.01} color={isActive ? '#ffffff' : '#000000'} />
      </Cylinder>
      <Cylinder args={[0, 0.9, 0.6, 16]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
    </group>
  );
}

// --- Main Node Component ---

function SupplyChainNode({ position, nodeData, isActive, delay = 0 }: any) {
  const color = isActive ? '#1E5EFF' : (nodeData.status === 'completed' ? '#1F5E3B' : '#CBD5E1');

  // Decide which shape to render based on the node type
  const renderShape = () => {
    switch (nodeData.type) {
      case 'farm': return <FarmShape color={color} isActive={isActive} />;
      case 'warehouse': return <WarehouseShape color={color} isActive={isActive} />;
      case 'port': return <ContainerShape color={color} isActive={isActive} />;
      case 'ship': return <CargoShipShape color={color} isActive={isActive} />;
      default: return <WarehouseShape color={color} isActive={isActive} />;
    }
  };

  return (
    <group position={position}>
      {renderShape()}
      
      {/* HTML Enterprise HUD Overlay */}
      <Html position={[0, isActive ? 2.2 : 1.5, 0]} center zIndexRange={[100, 0]}>
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: isActive ? 1 : 0.9 }}
          transition={{ delay: delay * 0.1 }}
          className={`rounded-lg shadow-lg border transition-all duration-300 w-64 ${
            isActive 
              ? 'bg-white border-blue-500 shadow-blue-500/20 ring-1 ring-blue-500' 
              : 'bg-white/90 backdrop-blur-md border-slate-200'
          }`}
        >
          <div className={`px-3 py-2 border-b flex items-center justify-between ${isActive ? 'bg-blue-50/50 border-blue-100' : 'border-slate-100'}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">{nodeData.title}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              nodeData.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
              nodeData.status === 'active' ? 'bg-blue-100 text-blue-700 animate-pulse' : 
              'bg-slate-100 text-slate-500'
            }`}>
              {nodeData.status.toUpperCase()}
            </span>
          </div>
          
          <div className="p-3 flex flex-col gap-2">
            {nodeData.details.map((detail: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <detail.icon size={12} />
                  <span>{detail.label}</span>
                </div>
                <span className="font-medium text-slate-700">{detail.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </Html>
    </group>
  );
}

// --- The 3D Scene ---

function SupplyChainScene() {
  const nodes = [
    { 
      type: 'farm', title: 'Origin Farm', pos: [-8, 0, 0], status: 'completed',
      details: [
        { label: 'Farm', value: 'Wade Banana Farm', icon: MapPin },
        { label: 'Harvest Vol', value: '24.0 Tons', icon: FileText },
        { label: 'Date', value: 'Oct 20, 2026', icon: Calendar }
      ]
    },
    { 
      type: 'warehouse', title: 'Packhouse Quality', pos: [-4, 0, 1.5], status: 'completed',
      details: [
        { label: 'Facility', value: 'Pune Cold Storage', icon: MapPin },
        { label: 'Grade', value: 'Grade A (Export)', icon: CheckCircle2 },
        { label: 'Temp Log', value: '2.0°C - 2.5°C', icon: Thermometer }
      ]
    },
    { 
      type: 'ship', title: 'Ocean Freight', pos: [0, 0, -1], status: 'active',
      details: [
        { label: 'Vessel', value: 'MSC Isabella', icon: Anchor },
        { label: 'Speed', value: '18.4 Knots', icon: MapPin },
        { label: 'Reefer Temp', value: '2.1°C', icon: Thermometer }
      ]
    },
    { 
      type: 'port', title: 'Destination Port', pos: [5, 0, 0], status: 'pending',
      details: [
        { label: 'Location', value: 'Rotterdam (RTM)', icon: MapPin },
        { label: 'Customs', value: 'Awaiting Doc', icon: FileText },
        { label: 'ETA', value: 'Nov 02, 2026', icon: Calendar }
      ]
    },
    { 
      type: 'warehouse', title: 'Buyer Hub', pos: [9, 0, 1], status: 'pending',
      details: [
        { label: 'Buyer', value: 'EuroFoods Inc.', icon: MapPin },
        { label: 'Contract', value: 'EUR-2026-88', icon: FileText }
      ]
    },
  ];

  const linePoints = nodes.map(n => new THREE.Vector3(...n.pos));

  return (
    <>
      {/* High-quality lighting setup */}
      <ambientLight intensity={0.6} color="#F8FAFC" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight intensity={0.4} groundColor="#F1F5F9" />
      
      {/* Trajectory path */}
      <Line points={linePoints} color="#94A3B8" lineWidth={4} dashed dashScale={20} dashSize={1} gapSize={1} />
      
      {nodes.map((node, i) => (
        <SupplyChainNode 
          key={i} 
          position={node.pos} 
          nodeData={node}
          isActive={node.status === 'active'}
          delay={i}
        />
      ))}

      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        minDistance={5} 
        maxDistance={25}
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below ground
        target={[0, 0, 0]}
      />
      
      {/* Detailed Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#F8FAFC" />
        <gridHelper args={[100, 100, '#E2E8F0', '#F1F5F9']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
      </mesh>
    </>
  );
}

// --- Main Page Component ---

export default function ShipmentsTracker() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex h-full absolute inset-0 bg-[#F8FAFC]"
    >
      
      {/* 3D Canvas Area */}
      <div className="flex-1 h-full relative cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 8, 16], fov: 35 }} shadows>
          <SupplyChainScene />
        </Canvas>

        {/* Floating Controls Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-medium text-slate-500 flex items-center gap-5">
          <span className="flex items-center gap-1.5"><kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Left Click</kbd> Orbit</span>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <span className="flex items-center gap-1.5"><kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Right Click</kbd> Pan</span>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <span className="flex items-center gap-1.5"><kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Scroll</kbd> Zoom</span>
        </div>
      </div>

      {/* Persistent Left Sidebar overlaying the 3D scene */}
      <div className="w-[320px] h-full bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 tracking-wide uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              In Transit
            </span>
            <span className="text-[11px] font-medium text-slate-500">Day 14 of 28</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Shipment #SHP-8924</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Navigating the Atlantic Ocean. Expected to reach Port of Rotterdam on Nov 02.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="p-5 grid grid-cols-2 gap-4 border-b border-slate-100 bg-slate-50">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Internal Temp</p>
            <p className="text-lg font-semibold text-emerald-600">2.1°C <span className="text-[11px] text-slate-400 font-medium ml-1">Stable</span></p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Container</p>
            <p className="text-sm font-mono font-medium text-slate-800 mt-1">MSCU-88492</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Product Manifest</p>
            <p className="text-[13px] font-medium text-slate-800">24.0 Tons — Premium Cavendish Bananas</p>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="flex-1 overflow-auto p-5">
          <h3 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-4">Event Log</h3>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* Active Event */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 animate-pulse"></div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-blue-50 border border-blue-100 shadow-sm ml-4 md:ml-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-[12px]">Vessel Departure</span>
                  <span className="text-[10px] text-slate-500 font-medium">Today, 08:00 AM</span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">Departed Nhava Sheva Port en route to Rotterdam.</div>
              </div>
            </div>

            {/* Past Event */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-white border border-slate-200 shadow-sm ml-4 md:ml-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-[12px]">Customs Cleared</span>
                  <span className="text-[10px] text-slate-500 font-medium">Oct 23, 14:30 PM</span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">Phytosanitary certificate verified and approved.</div>
              </div>
            </div>

            {/* Past Event */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-white border border-slate-200 shadow-sm ml-4 md:ml-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-[12px]">Packed & Graded</span>
                  <span className="text-[10px] text-slate-500 font-medium">Oct 21, 09:15 AM</span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">Graded Grade-A at Pune Cold Storage. Loaded to container.</div>
              </div>
            </div>

          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-white">
          <button className="w-full text-[13px] font-medium text-white bg-slate-900 px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2">
            <FileText size={16} />
            Access Export Documents
          </button>
        </div>
      </div>
      
    </motion.div>
  );
}
