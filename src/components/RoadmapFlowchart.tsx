
import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RoadmapData } from '@/types/roadmap';

interface RoadmapFlowchartProps {
  roadmap: RoadmapData;
}

const RoadmapFlowchart = ({ roadmap }: RoadmapFlowchartProps) => {
  // Generate nodes and edges from roadmap data
  const generateFlowchartData = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Start node
    nodes.push({
      id: 'start',
      type: 'input',
      data: { 
        label: (
          <div className="text-center">
            <div className="font-bold">Start</div>
            <div className="text-sm">{roadmap.title}</div>
          </div>
        )
      },
      position: { x: 250, y: 0 },
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: '2px solid #4f46e5',
        borderRadius: '12px',
        width: 200,
        height: 80,
      }
    });
    
    // Phase nodes
    roadmap.phases.forEach((phase, index) => {
      const nodeId = phase.id || `phase-${index + 1}`;
      nodes.push({
        id: nodeId,
        type: 'default',
        data: { 
          label: (
            <div className="text-center p-2">
              <div className="font-bold text-sm">{phase.title}</div>
              <div className="text-xs mt-1 opacity-75">{phase.duration}</div>
              <div className="text-xs mt-1">{phase.resources?.length || 0} resources</div>
            </div>
          )
        },
        position: { x: 250, y: (index + 1) * 160 },
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: '2px solid #8b5cf6',
          borderRadius: '12px',
          width: 200,
          height: 100,
        }
      });
      
      // Connect to previous node
      const sourceId = index === 0 ? 'start' : roadmap.phases[index - 1].id || `phase-${index}`;
      edges.push({
        id: `edge-${index}`,
        source: sourceId,
        target: nodeId,
        type: 'smoothstep',
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed' as any,
          color: '#8b5cf6',
        },
      });
    });
    
    // End node
    const endNodeId = 'end';
    nodes.push({
      id: endNodeId,
      type: 'output',
      data: { 
        label: (
          <div className="text-center">
            <div className="font-bold">Complete!</div>
            <div className="text-sm">You've mastered {roadmap.title}</div>
          </div>
        )
      },
      position: { x: 250, y: (roadmap.phases.length + 1) * 160 },
      style: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        border: '2px solid #ec4899',
        borderRadius: '12px',
        width: 200,
        height: 80,
      }
    });
    
    // Connect last phase to end
    if (roadmap.phases.length > 0) {
      const lastPhaseId = roadmap.phases[roadmap.phases.length - 1].id || `phase-${roadmap.phases.length}`;
      edges.push({
        id: `edge-final`,
        source: lastPhaseId,
        target: endNodeId,
        type: 'smoothstep',
        style: { stroke: '#ec4899', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed' as any,
          color: '#ec4899',
        },
      });
    }
    
    return { nodes, edges };
  }, [roadmap]);

  const { nodes, edges } = generateFlowchartData();
  const [nodesState, , onNodesChange] = useNodesState(nodes);
  const [edgesState, , onEdgesChange] = useEdgesState(edges);

  return (
    <div className="h-[600px] w-full bg-gray-900 rounded-lg border border-gray-700">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
        style={{ backgroundColor: '#111827' }}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap 
          nodeColor="#8b5cf6"
          maskColor="rgba(0, 0, 0, 0.8)"
          style={{ backgroundColor: '#1f2937' }}
        />
        <Controls 
          style={{ 
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
          }}
        />
        <Background 
          color="#374151" 
          gap={20} 
          style={{ backgroundColor: '#111827' }}
        />
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlowchart;
