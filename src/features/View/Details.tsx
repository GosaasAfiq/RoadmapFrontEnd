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
import { Roadmap } from "../../app/models/roadmap";

export default observer(function Detail() {
  const { id } = useParams<{ id: string }>();
  const { roadmapStore } = useStore();
  const { selectedRoadmap, loadRoadmap, loading } = roadmapStore;
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (id) loadRoadmap(id);
  }, [id, loadRoadmap]);

  useEffect(() => {
    if (selectedRoadmap && selectedRoadmap.nodes) {
      const roadmapNodes: Node[] = [];
      const roadmapEdges: Edge[] = [];

      const traverseNodes = (node: any, parentId: string | null = null) => {
        const isCompleted = node.isCompleted;
        const nodeColor = isCompleted ? "#4caf50" : "";

        roadmapNodes.push({
          id: node.id.toString(),
          data: {
            label: node.name,
            description: node.description,
            completionRate: node.completionRate,
            startDate: node.startDate,
            endDate: node.endDate,
            isCompleted: node.isCompleted,
            roadmapId: node.roadmapId,
            parentId: node.parentId
          },
          position: { x: 0, y: 0 },
          style: { backgroundColor: nodeColor },
        });

        if (parentId) {
          roadmapEdges.push({
            id: `e${parentId}-${node.id}`,
            source: parentId.toString(),
            target: node.id.toString(),
            type: "smoothstep",
          });
        }

        if (node.children && node.children.length > 0) {
          node.children.forEach((child: any) => traverseNodes(child, node.id));
        }
      };

      selectedRoadmap.nodes.forEach((node: any) => traverseNodes(node));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        roadmapNodes,
        roadmapEdges
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [selectedRoadmap]);

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowPopup(true);
  };

  const handleCheckboxChange = () => {
    if (selectedNode) {
      const confirmAction = window.confirm(
        `Are you sure you want to ${
          selectedNode.data.isCompleted ? "unmark" : "mark"
        } this node as completed?`
      );
  
      if (!confirmAction) return;

      // Update the isCompleted attribute in the selected node
      const updatedNode = {
        ...selectedNode,
        data: { ...selectedNode.data, isCompleted: !selectedNode.data.isCompleted },
      };

      // const updateParentIfAllChildrenCompleted = (parentId: string) => {
      //   console.log("Updating parent:", parentId);
      //   setNodes((prevNodes) => {
      //     const parentNode = prevNodes.find((node) => node.id === parentId);
      //     if (!parentNode){
      //       console.log("Parent node not found");
      //       return prevNodes;
      //     } 
  
      //     const childNodes = prevNodes.filter((node) => node.data.parentId === parentId);
      //     const allChildrenCompleted = childNodes.every((childNode) => childNode.data.isCompleted);

      //     console.log("All children completed for parent", parentId, ":", allChildrenCompleted);

      //     if (allChildrenCompleted && !parentNode.data.isCompleted) {
      //       const updatedParent = {
      //         ...parentNode,
      //         data: { ...parentNode.data, isCompleted: true },
      //       };
      //       console.log("Parent marked as completed:", updatedParent);
      //       return prevNodes.map((node) =>
      //         node.id === parentId ? updatedParent : node
      //       );
      //     }
      //     return prevNodes;
      //   });
      // };
  

      const updateChildren = (nodeId: string, isCompleted: boolean) => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => {
            if (node.data.parentId === nodeId) {
              const updatedChild = {
                ...node,
                data: { ...node.data, isCompleted },
              };
              updateChildren(node.id, isCompleted); // Recursive call for child nodes
              return updatedChild;
            }
            return node;
          })
        );
      };


      // Update the nodes state
      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
      );

    // If marking the node as completed, update its children too
      if (updatedNode.data.isCompleted) {
        updateChildren(updatedNode.id, true);  // Mark children as completed
      }
  
      // Update parent if all children are completed
      // if (!updatedNode.data.isCompleted) {
      //   const parentId = updatedNode.data.parentId;
      //   if (parentId) updateParentIfAllChildrenCompleted(parentId);
      // }


        setSelectedNode(updatedNode); // Update the local selectedNode state
    }
  };

  const handleSave = async () => {

    const confirmSave = window.confirm(
      "Are you sure you want to save? Changes cannot be undone."
    );
    
    if (!confirmSave) {
      return; // If user cancels, exit the function
    }

    if (selectedRoadmap) {
      // Prepare updated roadmap object
      const updatedRoadmap: Roadmap = {
        id: selectedRoadmap.id,
        userId: selectedRoadmap.userId,
        roadmapName: selectedRoadmap.roadmapName,
        isPublished: selectedRoadmap.isPublished,
        isCompleted: selectedRoadmap.isCompleted,
        isDeleted: selectedRoadmap.isDeleted, // Optional
        createdAt: selectedRoadmap.createdAt,
        updatedAt: new Date().toISOString(), // Set updated date to now
        startDate: selectedRoadmap.startDate,
        endDate: selectedRoadmap.endDate,
        completionRate: selectedRoadmap.completionRate,
        user: selectedRoadmap.user, // Include user if available
        nodes: nodes.map((node) => ({
            id: node.id,
            name: node.data.label,
            description: node.data.description,
            isCompleted: node.data.isCompleted,
            startDate: node.data.startDate,
            endDate: node.data.endDate,
            parentId: node.data.parentId,
            roadmapId: selectedRoadmap.id, // Use the selected roadmap's ID
        })),
    };

      // Send the updated roadmap JSON to the backend
      console.log("Updated Roadmap:", updatedRoadmap);

      // Example: Use fetch/axios to send the data to your backend
      // await store.roadmapStore.updateNode(updatedRoadmap);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedNode(null);
  };

  if (loading) return <LoadingComponent content="Loading roadmap details..." />;
  if (!selectedRoadmap) return <p>Roadmap not found!</p>;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedRoadmap.roadmapName}
          </h2>
          <div className="flex items-center">
            <div className="mt-2 w-full bg-gray-300 h-2 rounded-full">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${selectedRoadmap.completionRate}%`,
                  backgroundColor:
                    selectedRoadmap.completionRate >= 50 ? "#4caf50" : "#e74c3c",
                }}
              />
            </div>
            <p className="text-sm text-gray-500 ml-2">{`${selectedRoadmap.completionRate}%`}</p>
          </div>
        </div>

        {/* Right: Start and End Date, and Delete Button */}
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            {selectedRoadmap.startDate && (
              <span className="font-semibold text-gray-800 mr-6">Start Date: {selectedRoadmap.startDate}</span> // Added margin-right
            )}
            {selectedRoadmap.endDate && (
              <span className="font-semibold text-gray-800">End Date: {selectedRoadmap.endDate}</span>
            )}
          </div>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        >
          Save
        </button>

        <button
            // onClick={() => handleDeleteRoadmap(selectedRoadmap.id)} // Add a delete handler
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
          >
            Delete
          </button>
      </div>


      </div>
      <div className="flex-1 overflow-auto">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            style={{ width: "100%", height: "90%" }}
            onNodeClick={handleNodeClick}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {showPopup && selectedNode && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-grow text-lg font-bold text-gray-800 text-center">
                {selectedNode.data.label}
              </div>
              <button
                onClick={handleClosePopup}
                className="text-gray-600 text-3xl"
              >
                ×
              </button>
            </div>

            {/* Second Row: Start and End Date on the Left, Edit Date Button on the Right */}
      <div className="flex justify-between items-center mb-4">
        {/* Start and End Date */}
        <div className="text-sm text-gray-600">
          {selectedNode.data.startDate && selectedNode.data.endDate ? (
            <span className="font-semibold text-gray-800">
              {new Date(selectedNode.data.startDate).toLocaleDateString("en-GB")} - 
              {new Date(selectedNode.data.endDate).toLocaleDateString("en-GB")}
            </span>
          ) : (
            <span className="font-semibold text-gray-800">Dates Not Available</span>
          )}
        </div>

        {/* Edit Date Button on the Right */}
        <button
          onClick={() => console.log('Edit Date Clicked')} // Add functionality to edit date
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Edit Date
        </button>
      </div>

      {/* Node Completion Progress Bar */}
      <div className="flex items-center justify-center mb-4">
        {/* Progress Bar */}
        <div className="w-3/4 bg-gray-300 h-2 rounded-full">
          <div
            className="h-full rounded-full"
            style={{
              width: `${selectedNode.data.completionRate}%`,
              backgroundColor: selectedNode.data.completionRate >= 50 ? "#4caf50" : "#e74c3c",
            }}
          />
        </div>

        {/* Percentage Text Beside the Progress Bar */}
        <p className="text-sm text-gray-500 ml-2">{`${selectedNode.data.completionRate}%`}</p>
      </div>

            <textarea
              value={selectedNode.data.description || "No description available"}
              readOnly
              className="w-full h-40 p-4 text-gray-800 border border-gray-300 rounded-lg resize-none mb-4"
            />

            <div className="flex items-center justify-center mb-4">
              <label className="text-lg font-medium text-gray-700 mr-2">
                Mark as Completed:
              </label>
              <input
                type="checkbox"
                checked={selectedNode.data.isCompleted}
                onChange={handleCheckboxChange}
                className="w-6 h-6"
                disabled={selectedNode.data.isCompleted} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});



