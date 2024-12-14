import dagre from "dagre";
import { Node, Edge } from "react-flow-renderer";

// Initialize a new directed graph for Dagre
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: "LR" }); // Left to right layout
    
    // Add nodes to the graph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    
    // Add edges to the graph
    edges.forEach((edge) => {
        // Ensure that the edge source and target IDs are strings and match the node IDs
        dagreGraph.setEdge(edge.source.toString(), edge.target.toString());
    });

    // Run the Dagre layout algorithm
    dagre.layout(dagreGraph);

    // Update node positions based on the layout computed by Dagre
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};
