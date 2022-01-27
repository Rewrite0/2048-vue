export default function useGetBlock(store) {
	const getBlock = ({ x, y }) => {
		// 根据坐标返回block
		return store.blocks.find((block) => block.x === x && block.y === y);
	}

	return {
		getBlock
	}
}