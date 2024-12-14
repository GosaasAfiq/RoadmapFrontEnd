import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  ReactFlowProvider,
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
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (id) loadRoadmap(id);
  }, [id, loadRoadmap]);

  useEffect(() => {
    if (selectedRoadmap && selectedRoadmap.nodes) {
      const roadmapNodes: Node[] = [];
      const roadmapEdges: Edge[] = [];
  
      // Traverse the nodes recursively to build the graph
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
  
      // Sort milestone nodes based on createdAt
      const milestoneNodes = selectedRoadmap.nodes
        .filter((node: any) => node.type === "milestone")
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
      // Create edges connecting consecutive milestone nodes
      for (let i = 0; i < milestoneNodes.length - 1; i++) {
        const sourceNode = milestoneNodes[i];
        const targetNode = milestoneNodes[i + 1];
  
        roadmapEdges.push({
          id: `e${sourceNode.id}-${targetNode.id}`,
          source: sourceNode.id.toString(),
          target: targetNode.id.toString(),
          type: "smoothstep",
        });
      }
  
      // Use Dagre to arrange nodes and edges
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(roadmapNodes, roadmapEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [selectedRoadmap]);

  // Handle node click
  const handleNodeClick = (event: any, node: Node) => {
    setSelectedNode(node);
    setChecked(false); // Reset checkbox state
    setShowPopup(true);
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedNode(null);
  };

  if (loading) return <LoadingComponent content="Loading roadmap details..." />;
  if (!selectedRoadmap) return <p>Roadmap not found!</p>;

  return (
    <div className="h-screen">
      <h2 className="text-2xl font-bold mb-4">{selectedRoadmap.roadmapName}</h2>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          style={{ width: "100%", height: "90%" }}
          onNodeClick={handleNodeClick} // Correct event handler
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>

      {/* Full-screen Popup for node details */}
      {showPopup && selectedNode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Darkened background overlay
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Popup Box */}
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "40px", // Increased padding for larger content
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Soft shadow
              width: "60%", // Popup box width (60% of the screen width)
              maxWidth: "800px", // Maximum width to ensure it doesn't get too large
              textAlign: "center", // Center the text in the box
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClosePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              ×
            </button>

            <h3
              style={{
                fontSize: "24px", // Larger text for the title
                marginBottom: "20px", // Space below title
                fontWeight: "bold", // Bold title
                color: "#333", // Dark text color for readability
              }}
            >
              {selectedNode.data.label}
            </h3>

            <div
              style={{
                fontSize: "16px",
                color: "#555",
                marginBottom: "20px", // Space between label and checkbox
                maxWidth: "600px",
                margin: "0 auto", // Center the text
              }}
            >
              <label
                style={{
                  fontSize: "18px", // Larger font size for the checkbox label
                  fontWeight: "500",
                  marginRight: "10px",
                }}
              >
                Mark as Completed:
              </label>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                style={{
                  transform: "scale(1.5)", // Make the checkbox larger
                  marginTop: "5px", // Align the checkbox better with text
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
