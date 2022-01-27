import useCreateBlock from '@/hooks/useCreateBlock.js';

export default function useSaveLoad(store) {
	const { createBlock } = useCreateBlock(store);

	const init = () => {
		localStorage.clear();
		store.$reset();
		createBlock();
		createBlock();
	}

	const save = () => {
		// 执行前确保只有一个定时器
		clearTimeout(store.timer);
		store.timer = null;

		// 5s后保存进度
		store.timer = setTimeout(() => {
			const data = {
				score: store.score,
				blocks: store.blocks,
				auxId: store.auxId,
				gameOver: store.gameOver,
			}
			localStorage.setItem('GameData', JSON.stringify(data));
			store.saveTips = true;

			clearTimeout(store.timer);
			store.timer = null;
		}, 5000);
	}

	const load = () => {
		const data = JSON.parse(localStorage.getItem('GameData'));
		if(data !== null){
			store.score = data.score;
			store.blocks = data.blocks;
			store.auxId = data.auxId;
			store.gameOver = data.gameOver;
		}else{
			init();
		}
	}

	return {
		save,
		load,
		init
	}
}