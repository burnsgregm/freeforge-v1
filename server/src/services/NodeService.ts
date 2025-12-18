import { Node, INode } from '../models/Node';

export class NodeService {
    async createNode(data: Partial<INode>): Promise<INode> {
        // Validation: Check if nodeId exists
        const existing = await Node.findOne({ nodeId: data.nodeId });
        if (existing) {
            throw new Error('Node ID already exists');
        }

        const node = new Node(data);
        return await node.save();
    }

    async getNodes(filter: any = {}): Promise<INode[]> {
        return await Node.find(filter);
    }

    async getNode(nodeId: string): Promise<INode | null> {
        return await Node.findOne({ nodeId });
    }

    async updateNode(nodeId: string, data: Partial<INode>): Promise<INode | null> {
        return await Node.findOneAndUpdate({ nodeId }, data, { new: true });
    }

    async deleteNode(nodeId: string): Promise<boolean> {
        const result = await Node.deleteOne({ nodeId });
        return result.deletedCount === 1;
    }
}
