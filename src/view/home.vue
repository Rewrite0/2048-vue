<template>
<div class="container">

	<!-- S 游戏信息 -->
	<div class="msg-box">
		<div class="game-name">2048-vue</div>
		<!-- 新游戏按钮 -->
		<div class="new-game" @click="gameReStart">New Game</div>
		<!-- 分数 -->
		<div class="score">分数: {{score}}</div>
	</div>
	<!-- E 游戏信息 -->

	<!-- S 游戏容器 -->
	<game-box :gameOver="gameOver"
						@reStart="init()">
		<transition-group name="appear">

			<div
				class="block" 
				v-for="item in blocks"
				:id="`b${item.id}`"
				:key="item.id"
				:style="blockPosition(item)"
			>
				<v-block :num="item.num" />
			</div>

		</transition-group>
	</game-box>
	<!-- E 游戏容器 -->
</div>
</template>
<script>
import gameBox from '@/components/game-box'
import vBlock from '@/components/v-block'
export default {
	data(){
		return {
			score: 0,	// 分数
			blocks: [],
			auxId: 0,	// 辅助创建每个block的唯一id
			canMove: true,	// 判断是否可以移动
			gameOver: false,
		}
	},
	mounted() {
		this.init();
		this.keyBindings();
	},
	methods: {
		init() {	// 初始化
			this.blocks.length = 0;
			this.score = 0;
			this.auxId = 0;
			this.gameOver = false;
			this.createBlock();
			this.createBlock();
		},
		keyBindings(){	// 案件绑定
			document.addEventListener('keyup', (event) => {
				if (!this.canMove) {
					return;
				}
				switch (event.key.toLocaleUpperCase()) {
					case 'ARROWUP':
					case 'W':
						this.move('up');
						break;
					case 'ARROWDOWN':
					case 'S':
						this.move('down');
						break;
					case 'ARROWLEFT':
					case 'A':
						this.move('left');
						break;
					case 'ARROWRIGHT':
					case 'D':
						this.move('right');
						break;
				}
			});
		},
		createBlock(){	// 创建block
			if(this.isFull){	// 格子占满时停止执行
				return false;
			}

			let block = {	// block参数
				x: this.randomCoordinates(),	// x坐标
				y: this.randomCoordinates(),	// y坐标
				num: this.randomNum(),				// block值
				id: this.auxId++							// block id
			}

			while( this.getBlock({x: block.x, y: block.y}) ){ // 去重
				block.x = this.randomCoordinates();
				block.y = this.randomCoordinates();
			}

			this.blocks.push(block);
		},
		getBlock({ x, y }) { // 根据坐标返回block
			return this.blocks.find( block => block.x === x && block.y === y);
		},
		randomNum(){	// 随机生成2或4, 2的概率为70%
			return Math.floor(Math.random() * 10) < 7 ? 2 : 4
		},
		randomCoordinates(){	// 随机坐标, [0, 3]
			return Math.floor(Math.random() * 4)
		},
		getTop(el) {	// 辅助获取定位top
			return `${10 + el.y * 90}px`;
		},
		getLeft(el) {	// 辅助获取定位left
			return `${10 + el.x * 90}px`;
		},
		blockPosition(block){	// 定位block
			let style = {
				position: 'absolute',
				zIndex: block.num,
				top: this.getTop(block),
				left: this.getLeft(block)
			}
			return style;
		},
		groupSort(end, a, b){
			switch(end){
				case 0:
					return a - b;
				case 3:
					return b - a;
			}
		},
		move(dir){
			let param;
			switch(dir){
				case 'up':
					param = {group: 'x', coordinate: 'y', end: 0};
					break;
				case 'down':
					param = {group: 'x', coordinate: 'y', end: 3};
					break;
				case 'left':
					param = {group: 'y', coordinate: 'x', end: 0};
					break;
				case 'right':
					param = {group: 'y', coordinate: 'x', end: 3};
					break;
			}

			// 代表移动完成的变量
			let moveEnd = false;
			// 筛选行/列
			for(let i = 0; i < 4; i++){ 
				let group = this.blocks
										.filter( block => block[param.group] === i)
										.sort((a, b) => this.groupSort(param.end, a[param.coordinate], b[param.coordinate]));

				// 表示合并过的变量
				let visited = false;
				// 获取新数组中的每个block进行操作
				for(let n = 0; n < group.length; n++){

					if(n === 0){ // 判断数组中的第一个block
							// 如果这个block不在移动方向的顶点,则将其移动到顶点
						if( group[n][param.coordinate] !== param.end ){
							group[n][param.coordinate] = param.end;
							moveEnd = true;
						}
					}else{ // 数组中的其余block
							// 如果该block数值与前一个相等
						if( group[n].num === group[n-1].num && !visited){
							// 将该block移动到前一个block下
							group[n][param.coordinate] = group[n-1][param.coordinate];
							// 合并时禁止键盘输入
							this.canMove = false;
							// 获取该block的dom
							let dom1 = document.querySelector(`#b${group[n].id}`);
							// 监听该block的移动动画结束
							dom1.addEventListener('transitionend', () => {
								// 将当前block数值*2,获得两block合并的新数值
								let newNum = group[n-1].num * 2;
								// 将新数值赋给前一个block
								group[n-1].num = newNum;
								// 获取前一个block的dom
								let dom2 = document.querySelector(`#b${group[n-1].id}`);
								// 让前一个block展示合并动画
								this.animateMerge(dom2);
								// 移除当前block
								this.blocks.splice(this.getIndexById(group[n].id), 1);
								group.splice(n,1);
								n--;
								this.score += newNum;
							})
							moveEnd = true;
							visited = true;
						}else{ // 如果该block与前一个不相等,将其移到前一个block的后方
							if(param.end === 0){
								if(group[n][param.coordinate] !== group[n-1][param.coordinate] + 1){
									group[n][param.coordinate] = group[n-1][param.coordinate] + 1;
									moveEnd = true;
									visited = false;
								}
							}else{
								if(group[n][param.coordinate] !== group[n-1][param.coordinate] - 1){
									group[n][param.coordinate] = group[n-1][param.coordinate] - 1;
									moveEnd = true;
									visited = false;
								}
							}
						}
					}
				}
			}
			if(moveEnd){
				this.createBlock();
			}
			this.gameOver = this.isGameOver();
		},
		animateMerge(dom) { // 合并动画
			dom.animate(
				[
					{ transform: 'scale(0)' },
					{ transform: 'scale(1.2)' },
					{ transform: 'scale(1)' },
				],
				{
					duration: 150,
				}
			);
			this.canMove = true;
		},
		getIndexById(id) {
			return this.blocks.findIndex((block) => block.id === id);
		},
		isGameOver(){	// 判断游戏结束
			if(this.isFull){
					for(let y = 0; y < 4; y++){
						let row = this.blocks.filter( block => block.y === y).sort((a,b) => a.x - b.x);

						for(let x = 0; x < 4; x++){
							if(x < 3){
								if(row[x].num === row[x+1].num){
									return false;
								}
							}
							if(y < 3){
								let nextBlock = this.getBlock({x: x, y: y + 1});
								if(nextBlock !== undefined){
									nextBlock = nextBlock.num;
								}
								if(row[x].num === nextBlock ){
									return false;
								}
							}
						}
					}
					return true;
			}else{
				return false;
			}
		}
	},
	computed: {
		isFull(){	// 判断格子是否占满
			return this.blocks.length > 15;
		},
	},
  components: {
		gameBox,
		vBlock
	},
}
</script>

<style lang="scss" scope>
// 变量
$transitionTime: 0.2s; // 动画时长

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
			cursor: pointer;
		}

		.score{
			font-size: 18px;
			margin-bottom: 30px;
		}
	}

	.block{
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