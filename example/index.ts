import Vue from 'vue';
import App from '@/App.vue';
import { myLog } from '@/utils';
myLog('123');

import { test } from '~/index';
test();

new Vue({
	el: '#app',
	render: (h) => h(App),
});
