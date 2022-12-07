import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { sum } from '@core/utilityBelt';

function part1(lines: string[]): unknown {
    const limit = 100_000;
    const root = scanFs(lines);
    const dirSizes: Record<string, number> = {};
    collectDirSizes(root, dirSizes);
    const smallDirSizes = Object.values(dirSizes).filter((size) => size <= limit);
    return sum(smallDirSizes);
}

function part2(lines: string[]): unknown {
    const totalSize = 70_000_000;
    const requiredSize = 30_000_000;
    const dirSizes: Record<string, number> = {};

    const root = scanFs(lines);
    const rootSize = collectDirSizes(root, dirSizes);
    const freeSize = totalSize - rootSize;
    const sizeMissing = requiredSize - freeSize;

    const deleteCandidateSizes = Object.values(dirSizes)
        .filter((size) => size >= sizeMissing)
        .sort();

    return deleteCandidateSizes[0];
}

function scanFs(lines: string[]): DirNode {
    const root: DirNode = {
        type: 'dir',
        name: '/',
        nodes: [],
    };
    const context: Context = { cwd: [root] };

    const appendDir = (name: string): DirNode => {
        const existingNode = context.cwd.peek().nodes.find((dir) => isDir(dir) && dir.name === name) as DirNode;
        if (existingNode) {
            return existingNode;
        }

        const dirNode: DirNode = {
            type: 'dir',
            name,
            nodes: [],
        };

        context.cwd.peek().nodes.push(dirNode);

        return dirNode as DirNode;
    };

    const appendFile = (name: string, size: number): FileNode => {
        const existingNode = context.cwd.peek().nodes.find((file) => isFile(file) && file.name === name && file.size === size) as FileNode;
        if (existingNode) {
            return existingNode;
        }

        const fileNode: FileNode = {
            type: 'file',
            name,
            size,
        };

        context.cwd.peek().nodes.push(fileNode);

        return fileNode as FileNode;
    };

    for (const line of lines) {
        if (line.startsWith('$')) {
            const [_, cmd, arg] = line.split(' ');

            if (cmd === 'cd') {
                if (arg === '/') {
                    context.cwd = [root];
                } else if (arg === '..') {
                    context.cwd.pop();
                } else {
                    const dirNode = appendDir(arg);
                    context.cwd.push(dirNode);
                }
            } else if (cmd === 'ls') {
                continue; // We assume the output will always just work fine
            } else {
                throw new Error(line);
            }
        } else {
            if (line.startsWith('dir')) {
                const [_, dirName] = line.split(' ');
                appendDir(dirName);
            } else {
                const [sizeStr, fileName] = line.split(' ');
                appendFile(fileName, sizeStr.toInt());
            }
        }
    }

    return root;
}

type FileNode = {
    type: 'file';
    name: string;
    size: number;
};

type DirNode = {
    type: 'dir';
    name: string;
    nodes: FSNode[];
};

type FSNode = DirNode | FileNode;

type Context = {
    cwd: DirNode[];
};

function isDir(node: FSNode): node is DirNode {
    return node.type === 'dir';
}

function isFile(node: FSNode): node is FileNode {
    return node.type === 'file';
}

function printTree(node: FSNode, prefix: string = ''): void {
    if (isFile(node)) {
        console.log(`${prefix}- ${node.name} (file, size=${node.size})`)
    } else {
        console.log(`${prefix}- ${node.name} (dir)`);
        for (const child of node.nodes) {
            printTree(child, prefix + '  ');
        }
    }
}

function collectDirSizes(node: FSNode, acc: Record<string, number> = {}, parentPath = ''): number {
    if (isFile(node)) {
        return node.size;
    }

    const fullPath = `${parentPath}/${node.name}`;
    if (acc[fullPath] != null) {
        return acc[fullPath];
    }

    const totalSize = sum(node.nodes.map((child) => collectDirSizes(child, acc, fullPath)));
    acc[fullPath] = totalSize;

    return totalSize;
}

export default Solution.lines({
    part1,
    part2,
});

