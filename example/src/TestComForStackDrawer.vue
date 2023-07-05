<template>
	<div class="test-com">
		<TestStackDrawerChild v-if="show" v-bind="$attrs" v-on="$listeners" />
		<div @click="show = !show">点击</div>
		<div>
			<div v-for="li in list" :key="li" class="li" @click="clickOne(li)">
				{{ li }}
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onActivated } from 'vue';

import TestStackDrawerChild from './TestStackDrawerChild.vue';

export default defineComponent({
	components: { TestStackDrawerChild },
	props: {
		list: Array<string>,
	},
	setup(props, { emit }) {
		onActivated(() => {
			console.log('onActivated');
		});
		const clickOne = (da: string) => {
			emit('test', da);
		};

		const getSomething = () => {
			console.log('子组件 getSomething 方法被调用');
		};
		return { clickOne, getSomething };
	},
	data: () => ({
		show: false,
	}),
	activated() {
		console.log('activated');
	},
	deactivated() {
		console.log('xxxx deactivated');
	},
});
</script>

<style lang="scss">
.test-com {
	width: 400px;
	height: 100%;
	font-size: 14px;
	overflow-y: overlay;
	box-shadow: 0 0 10px 2px rgba(200, 200, 200, 1);
	background-color: #fff;
	padding: 20px;

	.li {
		width: 100%;
		line-height: 32px;
		border: 1px solid #ccc;
		margin-top: 5px;
	}
}
</style>
