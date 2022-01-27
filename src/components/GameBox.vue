<script setup>
import { useStore } from '@/store';
import { storeToRefs } from 'pinia';

const store = useStore();
const { saveTips } = storeToRefs(store);

const props = defineProps({
	gameOver: {
		type: Boolean,
		default: false
	},
})

const emit = defineEmits(['reStart']);
const reStart = () => {
	emit('reStart');
}

</script>

<template>
	<div class="game-box">
		<div class="item" v-for="i in 16" :key="i"></div>

		<div class="el-box">
			<slot></slot>
		</div>

		<div class="game-over" v-if="gameOver">
			<h1>Game Over!</h1>
			<h3 @click.stop="reStart">再来一次</h3>
		</div>

		<div class="game-save" :class="{tips: saveTips}">
			<h1>进度已保存</h1>
		</div>

	</div>
</template>

<style lang="scss" scope>
.game-box{
	box-sizing: border-box;
	display: grid;
	grid-template-rows: repeat(4, 80px);
	grid-template-columns: repeat(4, 80px);
	grid-gap: 10px 10px;
	background: #bbada0;
	border-radius: 10px;
	padding: 10px;
	width: fit-content;
	margin: 0 auto;
	position: relative;

	.item{
		background: #ccc0b3;
		border-radius: 5px;
	}

	.el-box{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.game-over{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba($color: #fff, $alpha: 0.8);

		h3{
			background: #8f7a66;
			color: #fff;
			padding: 5px 15px;
			border-radius: 5px;
			cursor: pointer;
		}
	}

	.game-save{
		position: absolute;
		z-index: 99;
		width: 100%;
		height: 100%;
		background: rgba($color: #fff, $alpha: 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.5s;
		opacity: 0;

		&.tips{
			opacity: 1;
		}

	}

}
</style>