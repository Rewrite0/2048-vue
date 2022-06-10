import useGetBlock from '@/hooks/useGetBlock.js';
import useCreateBlock from '@/hooks/useCreateBlock.js';
import useSaveLoad from '@/hooks/useSaveLoad.js';

export default function useBlockMove(store) {
	const { getBlock } = useGetBlock(store);
	const { createBlock} = useCreateBlock(store);
	const { save } = useSaveLoad(store);

	const isGameOver = () => {
		// 判断游戏结束
		if (store.isFull) {
			for (let y = 0; y < 4; y++) {
				let row = store.blocks
					.filter((block) => block.y === y)
					.sort((a, b) => a.x - b.x);

				for (let x = 0; x < 4; x++) {
					if (x < 3) {
						if (row[x].num === row[x + 1].num) {
							return false;
						}
					}
					if (y < 3) {
						let nextBlock = getBlock({ x: x, y: y + 1 });
						if (nextBlock !== undefined) {
							nextBlock = nextBlock.num;
						}
						if (row[x].num === nextBlock) {
							return false;
						}
					}
				}
			}
			return true;
		} else {
			return false;
		}
	}

	const getIndexById = (id) => {
		return store.blocks.findIndex((block) => block.id === id);
	}

	const AnimateMerge = (dom) => {
		// 合并动画
		dom.animate(
			[
				{ transform: "scale(0)" },
				{ transform: "scale(1.2)" },
				{ transform: "scale(1)" },
			],
			{
				duration: 150,
			}
		);
		store.canMove = true;
	}

	const blockMove = (dir) => {
		if(store.saveTips) store.saveTips = false;
		const param = getDir(dir);

		// 表示移动完成
		let moveEnd = false;
		for (let i = 0; i < 4; i++) {
			// 筛选出每行/列进行操作
			let group = store.blocks
				.filter((block) => block[param.group] === i)
				.sort((a, b) =>
					groupSort(param.end, a[param.coordinate], b[param.coordinate])
				);

			// 表示上一次已经合并
			let merge = false;
			for (let n = 0; n < group.length; n++) {
				// 对每个block进行操作
				// 当前操作的blcok
				let block = group[n];
				// 当前block前面的blcok
				let prevBlock = group[n - 1];

				switch (n) {
					case 0: // 移动第一个block
						if (block[param.coordinate] !== param.end) {
							// 不在移动终点时移动到终点
							block[param.coordinate] = param.end;
							moveEnd = true;
						}
						break;
					default:
						// 移动后面的block
						if (block.num === prevBlock.num && !merge) {
							// 当前block等于前一个并且之前没有发生合并
							// 将当前block移至前一个block下
							block[param.coordinate] = prevBlock[param.coordinate];
							// 合并时禁止键盘输入
							store.canMove = false;
							// 获取当前block的dom
							const dom1 = document.querySelector(`#b${block.id}`);
							const dom2 = document.querySelector(`#b${prevBlock.id}`);
							dom1.addEventListener("transitionend", () => {
								// 更新数值和分数
								store.score += prevBlock.num *= 2;
								// 展示合并动画
								AnimateMerge(dom2);
								// 移除block
								store.blocks.splice(getIndexById(block.id), 1);
								group.splice(n, 1);
								n--;
							});
							moveEnd = true;
							merge = true;
						} else {
							// 数值不等或前面已经发生了合并
							if (param.end === 0) {
								if (
									block[param.coordinate] !==	group[n - 1][param.coordinate] + 1
								) {
									block[param.coordinate] = prevBlock[param.coordinate] + 1;
									moveEnd = true;
									merge = false;
								}
							} else {
								if (
									block[param.coordinate] !==	group[n - 1][param.coordinate] - 1
								) {
									block[param.coordinate] = prevBlock[param.coordinate] - 1;
									moveEnd = true;
									merge = false;
								}
							}
						}
						break;
				}
			}
		}

		// 移动完成创建新block
		if(moveEnd) createBlock();
		store.gameOver = isGameOver();
		save();
	}

	return {
		blockMove
	}
}

const groupSort = (end, a, b) => {
	switch (end) {
		case 0:
			return a - b;
		case 3:
			return b - a;
	}
}

const getDir = dir => {
	let param;
	switch (dir) {
		case "up":
			param = { group: "x", coordinate: "y", end: 0 };
			break;
		case "down":
			param = { group: "x", coordinate: "y", end: 3 };
			break;
		case "left":
			param = { group: "y", coordinate: "x", end: 0 };
			break;
		case "right":
			param = { group: "y", coordinate: "x", end: 3 };
			break;
	}

	return param;
}
