<template>
<div class="container">

	<!-- S 游戏信息 -->
	<div class="msg-box">
		<div class="game-name">2048-vue</div>
		<!-- 新游戏按钮 -->
		<div class="new-game">New Game</div>
		<!-- 分数 -->
		<div class="score">分数: {{score}}</div>
	</div>
	<!-- E 游戏信息 -->

	<!-- S 游戏容器 -->
	<game-box>

	</game-box>
	<!-- E 游戏容器 -->
</div>
</template>
<script>
import gameBox from '@/components/gameBox'
export default {
	data(){
		return {
			score: 0,
		}
	},
  components: {
		gameBox
	},
}
</script>

<style lang="scss" scope>
.container{
	margin: 0 auto;

	.msg-box{
		padding-top: 10vw;
		text-align: center;

		.game-name{
			font-weight: bold;
			font-size: 26px;
		}

		.new-game{
			background: #8f7a66;
			color: #fff;
			width: 110px;
			border-radius: 10px;
			padding: 10px;
			margin: 10px auto;
		}

		.score{
			font-size: 18px;
			margin-bottom: 30px;
		}
	}



}
</style>