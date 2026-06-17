# AgriFlow: Advanced Features, 3D Experience & AI Roadmap

This document outlines the immersive 3D interface, analytics structure, and the artificial intelligence integration roadmap.

---

## 1. Three.js / React Three Fiber Supply Chain Experience

To provide buyers and exporters with an immersive tracking experience, AgriFlow integrates an interactive 3D WebGL scene built using **React Three Fiber (R3F)** and **Three.js**.

### Scene Storytelling Flow
The experience is configured as a linear 3D timeline split into 7 interactive stages. As the user clicks a stage, the virtual camera performs a smooth cubic bezier interpolation (lerp) to focus on that stage's 3D assets, rendering an HTML overlay with live database telemetry.

```
[ Farm ] ===> [ Harvest ] ===> [ Packhouse ] ===> [ Cold Storage ] ===> [ Logistics ] ===> [ Port ] ===> [ Buyer ]
```

1. **Scene 1: Farm**: Low-poly farm grid, crop fields (showing growing states).
   * *Overlay*: Temperature, soil moisture sensors, total area.
2. **Scene 2: Harvest**: Crate loading stations, digital scales.
   * *Overlay*: Net yield tons, variance metrics.
3. **Scene 3: Packhouse**: Sorting conveyor belts, workers sorting.
   * *Overlay*: Size sorting distribution, Grade A conversion yield.
4. **Scene 4: Cold Storage**: Warehouse structure with pallet racks.
   * *Overlay*: Live room temperature/humidity gauges.
5. **Scene 5: Logistics**: Inter-modal truck traversing a path.
   * *Overlay*: License plates, driver details, active ETA.
6. **Scene 6: Export Port**: Cargo ship docked next to port cranes.
   * *Overlay*: Container shipping status, Customs checklist.
7. **Scene 7: Buyer**: City skyline showing delivery warehouse.
   * *Overlay*: Purchase order value, satisfaction index, final signature.

### React Three Fiber Code Architecture

```jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';

// Stage camera coordinates (X, Y, Z)
const CAMERA_WAYPOINTS = {
  FARM: { x: 0, y: 15, z: 20 },
  HARVEST: { x: 25, y: 10, z: 20 },
  PACKAGING: { x: 50, y: 12, z: 18 },
  COLD_STORAGE: { x: 75, y: 8, z: 15 },
  LOGISTICS: { x: 100, y: 15, z: 25 },
  PORT: { x: 130, y: 20, z: 30 },
  BUYER: { x: 160, y: 10, z: 15 }
};

function SceneModel({ stage, ...props }) {
  // Lazily load low-poly glTF assets
  const { scene } = useGLTF('/assets/models/supply_chain_elements.glb');
  return <primitive object={scene} {...props} />;
}

function CameraController({ currentStage }) {
  useFrame(({ camera }) => {
    const target = CAMERA_WAYPOINTS[currentStage];
    if (target) {
      // Smooth linear interpolation for target alignment
      camera.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.05);
    }
  });
  return null;
}

export default function SupplyChainCanvas() {
  const [stage, setStage] = useState('FARM');
  
  return (
    <div className="w-full h-[600px] relative bg-slate-900 rounded-lg overflow-hidden">
      {/* 3D R3F Viewport */}
      <Canvas camera={{ position: [0, 15, 20], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        
        {/* Render models mapped along an X-axis path */}
        <SceneModel stage="FARM" position={[0, 0, 0]} />
        <SceneModel stage="HARVEST" position={[25, 0, 0]} />
        <SceneModel stage="PACKAGING" position={[50, 0, 0]} />
        <SceneModel stage="COLD_STORAGE" position={[75, 0, 0]} />
        <SceneModel stage="LOGISTICS" position={[100, 0, 0]} />
        
        {/* Dynamic camera navigation controller */}
        <CameraController currentStage={stage} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
        
        {/* 2D Data Overlay positioned relative to 3D Nodes */}
        <Html position={[0, 5, 0]} distanceFactor={15}>
          <div className="bg-slate-950/90 text-white p-3 rounded border border-emerald-500 shadow-xl w-48 text-xs font-mono">
            <h4 className="font-bold text-emerald-400">Wade Banana Farm</h4>
            <p>Moisture: 42%</p>
            <p>Status: Ready for Harvest</p>
          </div>
        </Html>
      </Canvas>
      
      {/* Control timeline buttons overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-slate-950/80 p-2 rounded-full border border-slate-700">
        {Object.keys(CAMERA_WAYPOINTS).map((key) => (
          <button 
            key={key} 
            onClick={() => setStage(key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${stage === key ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Performance Optimization Strategies
* **Dynamic Geometry Instancing**: Duplicate objects (crates, trees, trucks) are instantiated using `THREE.InstancedMesh` to execute single-pass draw calls.
* **Texture Baking & Simplification**: High-poly meshes are compressed using Draco compression (`npx gltf-pipeline`). All lights are baked into a single diffuse texture card to remove real-time shadow computation burdens on mobile devices.
* **Frustum Culling**: Objects outside the camera field of view (`camera.position`) are culled from rendering loops.

---

## 2. Notification Architecture

The notification engine routes system events across three distinct channels based on priority levels.

### Routing Table

| Alert Event | Severity | Channel | Notification Payload Template |
| :--- | :--- | :--- | :--- |
| **Harvest Ready** | Info | In-App / SMS | *"[FARM_NAME] crop cycle [CROP] has completed growing stage. Estimated yield: [TONS] Tons. Proceed to schedule harvesting."* |
| **Shipment Delayed**| High | In-App / Email | *"[CRITICAL] Shipment [SHIPMENT_NUM] carrying container [CONTAINER_NUM] is delayed at [CURRENT_PORT]. Adjusted ETA: [DATE]."* |
| **Payment Received**| Info | In-App / Email | *"Invoice payment of [AMOUNT] [CURRENCY] received from [BUYER_NAME] for Order [ORDER_NUM]."* |
| **Document Expiry** | Warning | In-App / Email | *"[WARNING] Phytosanitary Certificate for Shipment [SHIPMENT_NUM] expires in [DAYS] days. Upload updated certificate to prevent custom holds."* |
| **Temp Deviation**| Critical | In-App / SMS | *"[CRITICAL ALERT] Temperature in Cold Room [ROOM] registered [TEMP]°C (Target: [TARGET]°C ±1.5°C). Critical spoilage threat. Check facility."* |

---

## 3. Analytics & Reporting Specifications

The reporting modules extract raw records and generate download-ready formats.

### Report Configurator

| Report Type | Purpose | User Filters | Core Metrics Included | Export Options |
| :--- | :--- | :--- | :--- | :--- |
| **Operational** | Assess farm yield trends. | Crop Type, Farm ID, Date Range. | Expected vs. Actual yield, harvesting progress, waste rates. | PDF, CSV |
| **Export** | Evaluate shipping times. | Destination Country, Carrier. | Total containers shipped, transit duration averages, custom hold times. | Excel, CSV |
| **Revenue** | Measure company profits. | Date Range, Crop Type. | Total Revenue, Harvest cost, Packing cost, Shipping cost, Net profit. | Excel |
| **Buyer Report** | Analyze buyer demand. | Buyer ID, Date Range. | Lifetime purchase value, average order volume, payment delays. | PDF, CSV |
| **Cold Storage** | Monitor temperature. | Storage Unit, Date Range. | Temperature fluctuations, humidity averages, occupancy logs. | CSV |

---

## 4. Artificial Intelligence Roadmap

```
Phase 1: Yield & Demand Forecasting
      │
      ▼
Phase 2: Price & Profit Forecast
      │
      ▼
Phase 3: Computer Vision Quality Grading
      │
      ▼
Phase 4: Dynamic Route Optimization
```

### Phase 1: Yield Prediction & Demand Forecasting
* **ML Model**: XGBoost Regressor combined with Prophet for time-series forecasting.
* **Data Sources**: Historical crop cycle yields, weather sensor metrics (NDVI, soil moisture, rainfall), global demand imports databases.
* **Infrastructure**: Batch prediction scheduled via AWS EventBridge triggering Python serverless lambdas.
* **Business Value**: Allows exporters to pre-sell inventory to global buyers 60 days before harvesting.

### Phase 2: Price Forecasting & Profit Estimation
* **ML Model**: Long Short-Term Memory (LSTM) recurrent neural network architecture.
* **Data Sources**: Regional wholesale market indices, historical export custom pricing records, fuel cost projections.
* **Infrastructure**: PyTorch model runner packaged in Docker container hosted on AWS ECS.
* **Business Value**: Suggests optimal shipping windows to maximize sales margins.

### Phase 3: Computer Vision Quality Detection
* **ML Model**: YOLOv8 (You Only Look Once) or ResNet50 for object detection and defect bounding box segmentation.
* **Data Sources**: Tagged camera frame images of agricultural products (identifying spots, sizes, bruises).
* **Infrastructure**: Edge-deployed TensorFlow Lite running on localized packhouse tablets or sorting line cameras.
* **Business Value**: Eliminates subjective manual sorting mistakes, decreasing buyer rejection rates at import ports by 40%.

### Phase 4: Logistics Route Optimization
* **ML Model**: Mixed Integer Linear Programming (MILP) combined with genetic algorithms.
* **Data Sources**: Live vessel tracking feeds (AIS data), historical port congestion datasets, truck GPS transit routes.
* **Infrastructure**: FastAPI integration with Google OR-Tools routing solver backend.
* **Business Value**: Reduces transport time, lowering fuel costs and minimizing spoilage risk.

---

Proceed to commercialization metrics: **[06. Investor Assessment & Scorecard](file:///Users/0mrajput/Desktop/hoilday projects /AgriFlow/06_investor_assessment.md)**.
