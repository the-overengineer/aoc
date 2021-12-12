import { Solution } from '@core/DaySolution';

enum NodeType {
    Start,
    End,
    SmallCave,
    LargeCave,
};

type NodeName = string;

interface Node {
    name: NodeName;
    type: NodeType;
    connectsTo: Set<NodeName>;
}

type Graph = Map<NodeName, Node>;

function getNodeType(nodeName: NodeName): NodeType {
    switch (nodeName) {
        case 'start': return NodeType.Start;
        case 'end': return NodeType.End;
        default: return nodeName === nodeName.toLocaleUpperCase()
            ? NodeType.LargeCave
            : NodeType.SmallCave;
    }
}

function updateWithNode(graph: Graph, nodeName: NodeName, connectsTo: NodeName): void {
    if (!graph.has(nodeName)) {
        const node: Node = {
            name: nodeName,
            type: getNodeType(nodeName),
            connectsTo: new Set<NodeName>(),
        };

        graph.set(nodeName, node);
    }

    graph.get(nodeName)!.connectsTo.add(connectsTo);
}

function readGraph(lines: string[]): Graph {
    const graph = new Map<NodeName, Node>();

    for (const line of lines) {
        const [nodeA, nodeB] = line.split('-');
        updateWithNode(graph, nodeA, nodeB);
        updateWithNode(graph, nodeB, nodeA);
    }

    return graph;
}

function findValidPaths(graph: Graph, currentPath: NodeName[] = ['start']): NodeName[][] {
    const currentNode = graph.get(currentPath[currentPath.length - 1])!;

    if (currentNode.type === NodeType.End) {
        return [currentPath];
    }

    const nextCandidates = Array.from(currentNode.connectsTo).filter((next) => {
        const nextNode = graph.get(next)!;
        return nextNode.type === NodeType.LargeCave || !currentPath.includes(nextNode.name);
    });

    const discoveredPaths: NodeName[][] = [];

    for (const candidate of nextCandidates) {
        const paths = findValidPaths(graph, [...currentPath, candidate]);
        for (const path of paths) {
            discoveredPaths.push(path);
        }
    }
    
    return discoveredPaths;
}

function findValidPathsPermissive(
    graph: Graph,
    currentPath: NodeName[] = ['start'],
    revisitedSmallCave: boolean = false,
): NodeName[][] {
    const currentNode = graph.get(currentPath[currentPath.length - 1])!;

    if (currentNode.type === NodeType.End) {
        return [currentPath];
    }

    const nextCandidates = Array.from(currentNode.connectsTo).filter((next) => {
        const nextNode = graph.get(next)!;
        return nextNode.type === NodeType.LargeCave
            || (nextNode.type === NodeType.SmallCave && !revisitedSmallCave)
            || !currentPath.includes(nextNode.name);
    });

    const discoveredPaths: NodeName[][] = [];

    for (const candidate of nextCandidates) {
        const isRevisitedSmallCave = graph.get(candidate)!.type === NodeType.SmallCave
            && currentPath.includes(candidate);
        const willHaveRevisitedSmallCave = revisitedSmallCave || isRevisitedSmallCave;
        const paths = findValidPathsPermissive(graph, [...currentPath, candidate], willHaveRevisitedSmallCave);
        for (const path of paths) {
            discoveredPaths.push(path);
        }
    }
    
    return discoveredPaths;
}

async function part1(lines: string[]) {
    const graph = readGraph(lines);
    const paths = findValidPaths(graph);
    return paths.length;
}

async function part2(lines: string[]) {
    const graph = readGraph(lines);
    const paths = findValidPathsPermissive(graph);
    return paths.length;
}

export default Solution.lines({
    part1,
    part2,
});
