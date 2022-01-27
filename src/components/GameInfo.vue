<script setup>
import { useStore } from '@/store';
import { storeToRefs } from 'pinia';

const store = useStore();
const { score } = storeToRefs(store);

const props = defineProps({
	name: String,
	btnName: String,
	tips: String
})

const emit = defineEmits(['init'])
const init = () => {
	emit('init');
}

</script>

<template>
	<!-- S 游戏信息 -->
	<div class="msg-box">
		<div class="game-name">{{ name }}</div>
		<!-- 新游戏按钮 -->
		<div class="new-game" @click="init">{{ btnName }}</div>
		<!-- 分数 -->
		<div class="score">分数: {{ score }}</div>
		<div class="tips">{{ tips }}</div>
	</div>
	<!-- E 游戏信息 -->
</template>

<style lang='scss' scope>
  .msg-box {
    padding-top: 10vw;
    text-align: center;

    .game-name {
      font-weight: bold;
      font-size: 26px;
    }

    .new-game {
      background: #8f7a66;
      color: #fff;
      width: 110px;
      border-radius: 10px;
      padding: 10px;
      margin: 10px auto;
      cursor: pointer;
    }

    .score {
      font-size: 18px;
    }

		.tips {
			font: 16px;
		}

		& > div:last-child{
      margin-bottom: 30px;
		}

  }
</style>