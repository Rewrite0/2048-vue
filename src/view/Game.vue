<script setup>
import { onMounted, computed } from 'vue';
import GameInfo from '@/components/GameInfo.vue';
import GameBox from '@/components/GameBox.vue';
import VBlock from '@/components/VBlock.vue';
import { useStore } from '@/store';
import useKeyBindings from '@/hooks/useKeyBindings.js';
import useSaveLoad from '@/hooks/useSaveLoad.js';

const store = useStore();
const { load, init } = useSaveLoad(store);
const { keyBindings, moveUp, moveDown, moveLeft, moveRight } = useKeyBindings(store);


store.isFull = computed(() => store.blocks.length > 15);

onMounted(() => {
  // 按键绑定
  keyBindings();
  // 读取游戏
  load();
})

</script>

<template>
  <div
    class="container"
    v-touch:swipe.top="moveUp"
    v-touch:swipe.bottom="moveDown"
    v-touch:swipe.left="moveLeft"
    v-touch:swipe.right="moveRight"
  >
    <GameInfo
      name="2048-vue"
      btnName="New Game"
      tips="Tips: 游戏进度将在最后一次操作后5s保存"
      @init="init"
    />

    <GameBox
      :gameOver="store.gameOver"
      @reStart="init"
    >
      <transition-group name="appear">
        <VBlock
          class="block"
          v-for="block in store.blocks"
          :key="block.id"
          :block="block"
        />
      </transition-group>
    </GameBox>
  </div>
</template>

<style lang="scss" scope>
// 变量
$transitionTime: 0.2s; // 动画时长

.container {
  margin: 0 auto;
  width: 100%;
  height: 100%;

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

  .block {
    transition: $transitionTime top, $transitionTime left;
  }

  .appear-enter-active {
    animation: appear 100ms ease-in-out;
  }
  .appear-leave-active {
    transition: $transitionTime top, $transitionTime left;
  }
  @keyframes appear {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>