<template>
<div class="game-box">
	<div class="item" v-for="i in 16" :key="i"></div>

	<div class="el-box">
		<slot></slot>
	</div>
</div>
</template>
<script>
export default {
	
}
</script>
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
	}
}
</style>