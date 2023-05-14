<template>
	<div class="my-app">vue文件 {{ a }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const a = ref('xxx');
</script>

<style lang="scss" scoped>
.my-app {
	color: red;
}
</style>
