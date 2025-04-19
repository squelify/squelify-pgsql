import dagre from '@dagrejs/dagre'
import type { Edge, Node } from '@xyflow/react'

/**
 * Arranges nodes and edges in an organized layout using dagre algorithm
 * @param nodes - Array of nodes to be arranged
 * @param edges - Array of edges connecting the nodes
 * @param direction - Direction of the layout (TB: top-bottom, LR: left-right)
 * @returns Object containing arranged nodes and edges
 */
export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  // Set layout options
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
    ranker: 'network-simplex',
  })

  // Add nodes to the graph with their dimensions
  for (const node of nodes) {
    // Use actual node dimensions or defaults
    const width = 180
    const height = 150
    dagreGraph.setNode(node.id, { width, height })
  }

  // Add edges to the graph
  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target)
  }

  // Run the layout algorithm
  dagre.layout(dagreGraph)

  // Update node positions based on layout results
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90, // Half of width
        y: nodeWithPosition.y - 75, // Half of height
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
