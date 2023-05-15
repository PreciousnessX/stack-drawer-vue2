# StackDrawer

> StackDrawer 是一个可以无限push 任意vue组件,并挂载组件 的测弹窗组件; 支持返回、自定义容器、显示隐藏、遮罩层...


## 1. 基本使用

``` js
import StackDrawer from '@/components/StackDrawer';
const MyComponent = {
    template:`<div class="test-com">
                <ul>
                    <li
                        v-for="li in list"
                        :key="li"
                        class="li"
                        @click="clickOne(li)"
                    >{{ li }}</li>
                </ul>
            </div>`,
    props: {
        list: Array
    },
    setup(props, { emit }) {
        const clickOne = (da) => {
            emit('test', da);
        };

        const getSomething = () => {
            console.log('子组件 getSomething 方法被调用');
        };
        return { clickOne, getSomething };
    }
}

// 基本使用
StackDrawer
    .push(MyComponent, { list: [1,2,3,4] }, { mask: false })
    .$on('test', (da) => {
        console.log('test 事件触发',da)
    })
    .show(StackDrawer.getLength() < 2)
    .then(() => {
        console.log('show 完成');
    });

// 修改子组件props
StackDrawer.$$list = ['modify1', 'modify2', 'modify3', 'modify4'];

// 调用子组件方法
StackDrawer.$$getSomething();

// 挂载事件
const fn = (da) => { console.log(da) };
StackDrawer.$on('test',fn);

 // 卸载事件
StackDrawer.$off('test',fn)

// 打开 显示
StackDrawer.show(); 

// hide 隐藏
StackDrawer.hide();

// 关闭  会清空栈
StackDrawer.close();

```

## 2.StackDrawer API 列表


### &#160;&#160;&#160;&#160; 1. `setCustomWarp(customWarp:HTMLElement)` 自定义容器

&#160;&#160;&#160;&#160;&#160; 可以为StackDrawer指定dom容器customWarp, 推入的组件将渲染在customWarp中

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 2. `removeCustomWarp()` 移除自定义容器

&#160;&#160;&#160;&#160;&#160; 移除自定义容器后, 推入的组件将渲染在默认的dom中


&#160;&#160;&#160;&#160;



### &#160;&#160;&#160;&#160; 3. `push(component:Vue.ComponentOptions<Vue>, propsData:any, options:StackDrawerOptions = {}):StackDrawer` 推入一个组件

&#160;&#160;&#160;&#160;&#160; component：vue组件；propsData：component的props数据；options：Drawer 配置（具体参数件下方表格）; 返回 StackDrawer

| 属性名字 | 类型  | 是否必须 | 参数意义 | 默认值 |
| --- | --- | --- | --- | --- |
| width | number | no | 测弹窗宽度,不设置时为组件撑开的宽度 | - |
| customClass | string | no | 自定义类名 | - |
| mask | boolean | no | 是否有遮罩层, 使用自定义容器 该属性无效 | false |
| maskCloseAnimate | boolean | no | 遮罩层触发的关闭是否有动画, 使用自定义容器 该属性无效 | true |
| pushStack | boolean | no | 是否入栈, 设置为false 组件不会记录在栈中,无法返回 | true |
| keepEmit | boolean | no | 子组件非活跃状态下保持事件触发 | false |
| store | VueX | no | store 状态管理仓库，可以传入宿主vue实例的 store | - |


&#160;&#160;&#160;&#160;




### &#160;&#160;&#160;&#160; 4. `setGlobalOption(globalOptions:StackDrawerOptions)` 设置全局配置

&#160;&#160;&#160;&#160;&#160; 可以设置一个全局的配置, push方法中options将合并globalOptions

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 5. `$on(eventName:string, fn:Function):StackDrawer` 为当前组件注册事件

&#160;&#160;&#160;&#160;&#160; eventName: 事件名字, fn: 事件回调函数, 返回 StackDrawer

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 6. `$off(eventName:string, fn:Function)` 为当前组件移除事件

&#160;&#160;&#160;&#160;&#160; eventName: 事件名字, fn: 事件回调函数, 返回 StackDrawer

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 7. `async goBack(num:number = 1, animate = true) ` 返回上一页(上一个组件实例),动画结束后 异步执行完毕

&#160;&#160;&#160;&#160;&#160; num: 返回页数, animate: 是否有动画

&#160;&#160;&#160;&#160;

### &#160;&#160;&#160;&#160; 8. `async close(animate = true) ` 关闭测弹窗 销毁栈中所有组件 并清空栈,动画结束后 异步执行完毕

&#160;&#160;&#160;&#160;&#160; animate: 是否有动画

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 9. `async show(animate = true) ` 显示 ,动画结束后 异步执行完毕

&#160;&#160;&#160;&#160;&#160; animate: 是否有动画

&#160;&#160;&#160;&#160;

### &#160;&#160;&#160;&#160; 10. `async hide(animate = true) `隐藏 并不会清空栈,动画结束后 异步执行完毕

&#160;&#160;&#160;&#160;&#160; animate: 是否有动画

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 11. `getLength()`  获取栈长度

&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 12. `$$`  $$运算符可以操作当前组件的数据, 比如修改子组件props, 调用子组件方法


``` js
// 修改子组件中的list数据
StackDrawer.$$list = ['modify1', 'modify2', 'modify3', 'modify4', 'modify5', 'modify6'];

```

``` js
// 调用子组件中的getSomething方法
StackDrawer.$$getSomething();
```

## 3. 导出方法 列表
### &#160;&#160;&#160;&#160; 1. `getStackDrawer()`  工厂函数 构造多个StackDrawer

``` js
import { getStackDrawer } from '@/components/StackDrawer';
const otherStackDrawer = getStackDrawer(); // 工厂函数 构造多个StackDrawer
otherStackDrawer
    .push(MyComponent, { list: [1,2,3,4] }, { mask: false })
    .$on('test', (da) => {
        console.log('test 事件触发',da)
    })
    .show(StackDrawer.getLength() < 2)
    .then(() => {
        console.log('show 完成');
    });
```
&#160;&#160;&#160;&#160;


## Tips 提示
### &#160;&#160;&#160;&#160; 1. 请在调用show() 方法之前 注册事件, show方法之后注册的事件 将不生效

``` js
StackDrawer
    .push(MyComponent, { list: [1,2,3,4] }, { mask: false })
    .$on('test', (da) => {
        console.log('test 事件触发',da)
    })
    .show(StackDrawer.getLength() < 2)
    .then(() => {
        console.log('show 完成');
    });

// test2 事件不会生效
StackDrawer.$on('test2',() => {
     console.log('never');
})
```
&#160;&#160;&#160;&#160;


### &#160;&#160;&#160;&#160; 2. StackDrawer 会调用组件的 activated 和 deactivated 生命周期, 当StackDrawer.push一个新的组件后,上一个组件将执行deactivated, 当调用当StackDrawer.goback, 当前组件将执行deactivated, 前一个组件将执行activated
&#160;&#160;&#160;&#160;

