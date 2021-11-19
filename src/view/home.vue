<template>
<div class="container">

	<!-- S 游戏信息 -->
	<div class="msg-box">
		<div class="game-name">2048-vue</div>
		<!-- 新游戏按钮 -->
		<div class="new-game" @click="init">New Game</div>
		<!-- 分数 -->
		<div class="score">分数: {{score}}</div>
	</div>
	<!-- E 游戏信息 -->

	<!-- S 游戏容器 -->
	<game-box :gameOver="gameOver"
						@reStart="init">
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
			this.blocks = [];
			this.score = 0;
			this.auxId = 0;
			this.gameOver = false;
			this.createBlock();
			this.createBlock();
		},
		keyBindings(){	// 按键绑定
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

			// 随机2或4
			const randomNum = Math.floor( Math.random() * 10 ) < 8 ? 2 : 4;
			// 随机坐标 [0, 3]
			const randomCoordinates = () => Math.floor( Math.random() * 4 );

			const block = {	// block参数
				x: randomCoordinates(),
				y: randomCoordinates(),
				num: randomNum,
				id: this.auxId++,	// block唯一id
			}

			while( this.getBlock({x: block.x, y: block.y}) ){ // 去重
				block.x = randomCoordinates();
				block.y = randomCoordinates();
			}

			// 使用promise确保创建后能获取到dom
			const create = el => {
				return new Promise( resolve => {
					this.blocks.push(el);
					resolve(true)
				})
			}
			create(block).then(() => {
				let dom = document.querySelector(`#b${block.id}`)
				this.animateCreate(dom)
			})
		},
		getBlock({ x, y }) { // 根据坐标返回block
			return this.blocks.find( block => block.x === x && block.y === y);
		},
		blockPosition(block){	// 定位block
			const top = `${10 + block.y * 90}px`;
			const left = `${10 + block.x * 90}px`;
			const style = {
				position: 'absolute',
				zIndex: block.num,
				top,
				left,
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

			// 表示移动完成
			let moveEnd = false;
			for(let i = 0; i < 4; i++){	// 筛选出每行/列进行操作
				let group = this.blocks
										.filter( block => block[param.group] === i)
										.sort((a, b) => this.groupSort(param.end, a[param.coordinate], b[param.coordinate]));

				// 表示上一次已经合并
				let merge = false;
				for(let n = 0; n < group.length; n++){	// 对每个block进行操作
					// 当前操作的blcok
					let block = group[n];	
					// 当前block前面的blcok
					let prevBlock = group[n-1];

					switch(n){
						case 0:	// 移动第一个block
							if(block[param.coordinate] !== param.end){	// 不在移动终点时移动到终点
								block[param.coordinate] = param.end;
								moveEnd = true;
							}
							break;
						default:	// 移动后面的blck
							if(block.num === prevBlock.num && !merge){	// 当前block等于前一个并且之前没有发生合并
								// 将当前block移至前一个block下
								block[param.coordinate] = prevBlock[param.coordinate];
								// 合并时禁止键盘输入
								this.canMove = false;
								// 获取当前block的dom
								const dom1 = document.querySelector(`#b${block.id}`);
								const dom2 = document.querySelector(`#b${prevBlock.id}`);
								dom1.addEventListener('transitionend', () => {
									// 更新数值和分数
									this.score += prevBlock.num *= 2;
									// 展示合并动画
									this.animateMerge(dom2);
									// 移除block
									this.blocks.splice(this.getIndexById(block.id), 1);
									group.splice(n, 1);
									n--;
								})
								moveEnd = true;
								merge = true;
							}else{	// 数值不等或前面已经发生了合并
								if(param.end === 0){
									if(block[param.coordinate] !== group[n-1][param.coordinate] + 1){
										block[param.coordinate] = prevBlock[param.coordinate] + 1
										moveEnd = true;
										merge = false;
									}
								}else{
									if(block[param.coordinate] !== group[n-1][param.coordinate] - 1){
										block[param.coordinate] = prevBlock[param.coordinate] - 1
										moveEnd = true;
										merge = false;
									}
								}
							}
							break;
					}
				}

			}

			// 移动完成创建新block
			if(moveEnd) this.createBlock();
			// 判断游戏结束
			this.gameOver = this.isGameOver();
		},
		animateCreate(dom) { // 创建动画
			dom.animate(
				[
					{ transform: 'scale(0)' },
					{ transform: 'scale(1)' },
				],
				{
					duration: 200,
				}
			);
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
			return this.blocks.findIndex( block => block.id === id);
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