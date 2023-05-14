<template>
	<div style="font-size: 14px; color: #000" @click="tap">{{ aaa }}-dian</div>
</template>
<script lang="ts">
import { defineComponent, onActivated, onMounted } from 'vue';

export default defineComponent({
	props: {
		aaa: {
			type: String,
		},
	},
	setup(props, { emit }) {
		onActivated(() => {
			console.log('onActivated2');
		});
		console.log(123);
		const tap = () => {
			emit('tap', 'xxxxxxxxxxxxx');
		};
		onMounted(() => {
			console.log('xxxxxxx', 123);
		});
		return { tap };
	},
	beforeCreate() {
		console.log('xxxx', 123);
	},
	activated() {
		console.log('activated2');
	},
});
</script>
