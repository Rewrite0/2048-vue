<script setup>
import { reactive, computed } from 'vue';

const blockColor = reactive({
	2: '#eee4da',
	4: '#ede0c8',
	8: '#f2b179',
	16: '#f59563',
	32: '#f67c5f',
	64: '#f65e3b',
	128: '#edcf72',
	256: '#edcc61',
	512: '#0444BF',
	1024: '#A79674',
	2048: '#282726',
	4096: '#280b21',
	8192: '#281d04',
})

const props = defineProps({
	block: Object
})

const blockStyle = computed(() => {
	const num = props.block.num;

	const bg = num <= 8192 ? blockColor[num] : '#000';
	const color = num > 4 && '#fff';
	const fs = num > 8192 && '22px';
	const top = `${10 + props.block.y * 90}px`;
	const left = `${10 + props.block.x * 90}px`;

	return {
		background: bg,
		color: color,
		fontSize: fs,
		position: "absolute",
		zIndex: props.block.id,
		top,
		left,
	}
})

</script>

<template>
	<div
		class="v-block"
		:id="`b${block.id}`"
		:style="[blockStyle]"
	>{{ block.num }}</div>
</template>

<style lang="scss" scope>
.v-block{
	$size: 80px;
	width: $size;
	height: $size;
	border-radius: 5px;
	font-size: 32px;
	font-weight: bold;
	color: #776e65;
	line-height: $size;
	display: flex;
	align-content: center;
	justify-content: center;
}
</style>