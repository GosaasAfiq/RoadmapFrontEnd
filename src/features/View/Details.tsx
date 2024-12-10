import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
} from "react-flow-renderer";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { getLayoutedElements } from "./Dagre";

export default observer(function Detail() {
  const { id } = useParams<{ id: string }>();
  const { roadmapStore } = useStore();
  const { selectedRoadmap, loadRoadmap, loading } = roadmapStore;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (id) loadRoadmap(id);
  }, [id, loadRoadmap]);

  // Transform roadmap data into nodes and edges
  useEffect(() => {
    if (selectedRoadmap && selectedRoadmap.nodes) {
      const roadmapNodes: Node[] = [];
      const roadmapEdges: Edge[] = [];

      const traverseNodes = (node: any, parentId: string | null = null) => {
        // Add the current node with unique ID
        roadmapNodes.push({
          id: node.id.toString(), // Ensure it's a string
          data: { label: node.name },
          position: { x: 0, y: 0 }, // Initial position will be calculated
        });

        // Add edge connecting to parent, if any
        if (parentId) {
          roadmapEdges.push({
            id: `e${parentId}-${node.id}`,
            source: parentId.toString(),
            target: node.id.toString(),
            type: "smoothstep",
          });
        }

        // Traverse child nodes
        if (node.children && node.children.length > 0) {
          node.children.forEach((child: any) => traverseNodes(child, node.id));
        }
      };

      selectedRoadmap.nodes.forEach((node: any) => traverseNodes(node));

      // Use Dagre to arrange nodes and edges
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(roadmapNodes, roadmapEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [selectedRoadmap]);

  if (loading) return <LoadingComponent content="Loading roadmap details..." />;
  if (!selectedRoadmap) return <p>Roadmap not found!</p>;

  return (
    <div className="h-screen">
      <h2 className="text-2xl font-bold mb-4">{selectedRoadmap.roadmapName}</h2>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        style={{ width: "100%", height: "90%" }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
});
