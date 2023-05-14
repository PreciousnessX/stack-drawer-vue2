<template>
	<div class="test-com">
		<TestStackDrawerChild v-if="show" v-bind="$attrs" v-on="$listeners" />
		<div @click="show = !show">点击</div>
		<ul>
			<li
				v-for="li in list"
				:key="(li as string)"
				class="li"
				@click="clickOne(li as string)"
			>
				{{ li }}
			</li>
		</ul>
	</div>
</template>
<script lang="ts">
import { defineComponent, onActivated } from 'vue';

import TestStackDrawerChild from './TestStackDrawerChild.vue';

export default defineComponent({
	components: { TestStackDrawerChild },
	props: {
		list: Array,
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

<style lang="less">
.test-com {
	width: 400px;
	height: 100%;
	font-size: 14px;
	overflow-y: overlay;
	box-shadow: 0 0 10px 2px rgba(200, 200, 200, 1);
	background-color: #fff;
	padding: 20px;

	.li {
		line-height: 32px;
		border: 1px solid #ccc;
		margin-top: 5px;
	}
}
</style>
