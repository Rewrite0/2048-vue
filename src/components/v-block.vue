<template>
<div class="v-block" :style="{background: getColor, color: num > 4 ? '#fff' : '#776e65'}">{{num}}</div>
</template>

<script>
export default {
	data() {
		return {
			color: {
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
			},
		}
	},
	props: {
		num: {
			type: Number
		}
	},
	computed: {
		getColor(){
			return this.color[this.num];
		}
	}
}
</script>

<style lang="scss" scope>
.v-block{
	$size: 80px;
	width: $size;
	height: $size;
	border-radius: 5px;
	font-size: 32px;
	font-weight: bold;
	line-height: $size;
	display: flex;
	align-content: center;
	justify-content: center;
}
</style>