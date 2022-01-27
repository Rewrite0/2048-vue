import useGetBlock from '@/hooks/useGetBlock.js';

const animateCreate = (dom) => {
	// 创建动画
	dom.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
		duration: 200,
	});
}

export default function useCreateBlock(store) {
	const { getBlock } = useGetBlock(store);

	const createBlock = () => {
		// 格子满时不再创建
		if(store.isFull) return false;

		// 随机2或4
		const randomNum = Math.floor(Math.random() * 10) < 8 ? 2 : 4;
		// 随机坐标 [0, 3]
		const randomCoordinates = () => Math.floor(Math.random() * 4);

		const block = {
			x: randomCoordinates(),
			y: randomCoordinates(),
			num: randomNum,
			// block唯一id
			id: store.auxId++
		}

		while(getBlock({ x: block.x, y: block.y })) {
			// 去重
			block.x = randomCoordinates();
			block.y = randomCoordinates();
		}

		// 使用promise确保创建后能获取到dom
		const create = (el) => {
			return new Promise((resolve) => {
				store.blocks.push(el);
				resolve(true);
			});
		};
		create(block).then(() => {
			const dom = document.querySelector(`#b${block.id}`);
			animateCreate(dom);
		});
	}

	return {
		createBlock
	}
}