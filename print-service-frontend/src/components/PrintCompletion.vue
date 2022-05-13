<template>
    <div class="completion">
        <div class="notice">打印指令已经全部提交完毕</div>
        <div class="notice">请等待打印完毕</div>
        <div class="notice">然后取走打印好的文档</div>
    </div>
</template>
<style>
.completion {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.notice {
    font-size: 20rem;
    line-height: 30rem;
    color: #909090;
}
</style>