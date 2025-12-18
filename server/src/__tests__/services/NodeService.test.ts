import { NodeService } from '../../services/NodeService';
import { Node } from '../../models/Node';

// Mock the Mongoose Model
jest.mock('../../models/Node');

describe('NodeService', () => {
    let nodeService: NodeService;

    beforeEach(() => {
        nodeService = new NodeService();
        jest.clearAllMocks();
    });

    it('should create a node successfully', async () => {
        const mockNodeData = {
            nodeId: 'TEST_001',
            name: 'Test Node',
            position: { x: 0, y: 0, z: 0 },
            status: 'active'
        };

        // Mock findOne to return null (not found)
        (Node.findOne as jest.Mock).mockResolvedValue(null);

        // Mock create
        (Node.create as jest.Mock).mockResolvedValue(mockNodeData);

        const result = await nodeService.createNode(mockNodeData);

        expect(Node.findOne).toHaveBeenCalledWith({ nodeId: 'TEST_001' });
        expect(Node.create).toHaveBeenCalledWith(mockNodeData);
        expect(result).toEqual(mockNodeData);
    });

    it('should throw error if node already exists', async () => {
        const mockNodeData = { nodeId: 'DUPLICATE_001', name: 'Dup' };

        // Mock findOne to return existing doc
        (Node.findOne as jest.Mock).mockResolvedValue({ nodeId: 'DUPLICATE_001' });

        await expect(nodeService.createNode(mockNodeData))
            .rejects
            .toThrow('Node with this ID already exists');
    });

    it('should get all nodes', async () => {
        const mockNodes = [{ nodeId: 'N1' }, { nodeId: 'N2' }];
        (Node.find as jest.Mock).mockResolvedValue(mockNodes);

        const result = await nodeService.getAllNodes();

        expect(Node.find).toHaveBeenCalled();
        expect(result).toHaveLength(2);
    });
});
