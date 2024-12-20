import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, Node, Edge, ReactFlowProvider } from "react-flow-renderer";
import { useLocation } from "react-router-dom";
import { getLayoutedElements } from "./Dagre"; // Assuming Dagre layout helper is available

const Preview = () => {
    const location = useLocation();
    const roadmapData = location.state?.roadmap; // Access the roadmap data
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        if (roadmapData) {
            const roadmapNodes: Node[] = [];
            const roadmapEdges: Edge[] = [];

            // Helper to generate unique IDs for missing ones
            const generateId = () => `node-${Math.random().toString(36).substr(2, 9)}`;

            // Recursive function to traverse the hierarchy
            const traverseNodes = (node: any, parentId: string | null = null) => {
                const nodeId = node.id || generateId();

                // Add current node
                roadmapNodes.push({
                    id: nodeId,
                    data: { label: node.name || "Unnamed" },
                    position: { x: 0, y: 0 }, // Layout will update this
                    style: { border: "1px solid black", padding: "10px" },
                });

                // Add an edge if there is a parent
                if (parentId) {
                    roadmapEdges.push({
                        id: `e${parentId}-${nodeId}`,
                        source: parentId,
                        target: nodeId,
                        type: "smoothstep",
                    });
                }

                // Traverse sections
                if (node.sections) {
                    node.sections.forEach((section: any) => traverseNodes(section, nodeId));
                }

                // Traverse subsections
                if (node.subSections) {
                    node.subSections.forEach((subSection: any) => traverseNodes(subSection, nodeId));
                }
            };

            // Start traversal from milestones
            roadmapData.milestones.forEach((milestone: any) => traverseNodes(milestone));

            // Apply layout
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                roadmapNodes,
                roadmapEdges
            );

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [roadmapData]);

    return (
        <div className="h-screen">
            
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-800">
                    {roadmapData?.name || "Unnamed Roadmap"}
                    </h2>
                </div>
            </div>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    style={{ width: "100%", height: "90%" }}
                >
                    <Background color="#aaa" gap={16} />
                    <Controls />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default Preview;
