<template>
    <div class="switch">
        <div class="switch-text">
            <slot></slot>
        </div>
        <div class="switch-frame">
            <div class="switch-box" :class="{ active: active }">
                <div class="switch-button" :class="{ active: active }"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:["active"]
}
</script>
<style>
.switch {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}
.switch-text{
    flex-grow: 1;
    text-align: left;
    font-size: 24rem;
    line-height: 24rem;
    letter-spacing: 1rem;
}
.switch-frame {
    flex-grow: 0;
    flex-shrink: 0;
    width: 46rem;
    height: 100%;
    margin-right: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.switch-box {
    width: 100%;
    height: 20rem;
    border-radius: 12rem;
    background-color: #808080;
    transition: all 300ms;
}

.switch-box.active {
    background-color: #5068D0;
}

.switch-button {
    width: 30rem;
    height: 30rem;
    position: relative;
    left: -4rem;
    top: -5rem;
    border-radius: 20rem;
    background-color: #9f9f9f;
    transition: all 300ms;
}

.switch-button.active {
    left: 21rem;
    background-color: #99afff;

}
</style>