import {  defineStore } from 'pinia';

export const useStore = defineStore('main', {
	state: () => {
		return {
			score: 0,
			auxId: 0,
			blocks: [],
			canMove: true,
			gameOver: false,
			timer: null,
			saveTips: false,
			isFull: false,
		}
	}
})