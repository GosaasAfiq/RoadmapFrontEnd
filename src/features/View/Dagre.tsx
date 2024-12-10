// src/utils/Dagre.tsx
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
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Run the Dagre layout algorithm
    dagre.layout(dagreGraph);

    // Calculate final positions for each node
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};
