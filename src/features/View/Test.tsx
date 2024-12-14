// import { useEffect, useState } from "react";
// import Tree from "react-d3-tree";
// import { observer } from "mobx-react-lite";
// import { useStore } from "../../app/stores/store"; // Adjust the path as necessary
// import { Roadmap } from "../../app/models/roadmap"; // Adjust the path as necessary
// import { Node } from "../../app/models/node"; // Adjust the path as necessary

// export default observer(function Test() {
//     const { roadmapStore } = useStore();
//     const [treeData, setTreeData] = useState<any>(null); // `any` to match the format of react-d3-tree
    

//     // Convert a single Node to the react-d3-tree format
//     const convertNodeToTree = (node: Node): any => {
//         return {
//             name: node.name,
//             attributes: {
//                 description: node.description,
//                 completed: node.isCompleted ? "Yes" : "No",
//                 startDate: node.startDate || "N/A",
//                 endDate: node.endDate || "N/A",
//             },
//             children: node.children?.map(convertNodeToTree),
//         };
//     };

//     // Convert Roadmap to the tree structure
//     const convertRoadmapToTree = (roadmap: Roadmap): any => {
//         return {
//             name: roadmap.roadmapName,
//             attributes: {
//                 userId: roadmap.userId,
//                 isPublished: roadmap.isPublished ? "Yes" : "No",
//                 isCompleted: roadmap.isCompleted ? "Yes" : "No",
//             },
//             children: roadmap.nodes.map(convertNodeToTree),
//         };
//     };

//     useEffect(() => {
//         const fetchRoadmap = async () => {
//             await roadmapStore.loadRoadmap("roadmap-id"); // Replace "roadmap-id" with the actual ID or pass dynamically
//             if (roadmapStore.selectedRoadmap) {
//                 const tree = convertRoadmapToTree(roadmapStore.selectedRoadmap);
//                 setTreeData(tree);
//             }
//         };

//         fetchRoadmap();
//     }, [roadmapStore]);

//     if (!treeData) return <div>Loading...</div>;

//     return (
//         <div style={{ width: "100%", height: "100vh" }}>
//             <Tree
//                 data={treeData}
//                 orientation="vertical"
//                 pathFunc="step"
//                 translate={{ x: 400, y: 100 }}
//                 nodeSvgShape={{
//                     shape: "circle",
//                     shapeProps: {
//                         r: 10,
//                         fill: "#000",
//                     },
//                 }}
//                 nodeSize={{ x: 200, y: 100 }}
//             />
//         </div>
//     );
// });
