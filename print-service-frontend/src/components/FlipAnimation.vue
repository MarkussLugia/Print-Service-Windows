<template>
    <div class="flip-animation">
        <div class="notice">请在偶数面全部打印完毕后</div>
        <div class="notice">按照演示一并翻转全部纸张并插回纸槽</div>
        <div class="notice">然后点击下方的”继续“键</div>
        <div class="animation">
            <div class="printer"></div>
            <div class="paperbox" ref="paperbox">
                <div class="paper" ref="paper">====<br>===<br>====<br>==</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted() {
        this.$refs.paperbox.animate(
            [
                { transform: 'rotate3d(1,0,0,50deg)', zIndex: 1, offset: 0, easing: "ease-out" },
                { transform: 'rotate3d(1,0,0,50deg)', zIndex: 1, offset: 0.15, easing: "ease-in-out" },
                { transform: 'rotate3d(1,0,0,0deg)', zIndex: 3, offset: 0.3 },
                //出纸结束
                { transform: 'rotate3d(0,1,0,0deg)', zIndex: 3, offset: 0.4, easing: "ease-in-out" },
                { transform: 'rotate3d(0,1,0,180deg)', zIndex: 3, offset: 0.6 },
                { transform: 'rotate3d(0,1,0,0deg) translateY(0rem)', zIndex: 3, offset: 0.6 },
                //翻转结束
                { transform: 'rotate3d(1,0,0,0deg) translateY(0rem)', zIndex: 3, offset: 0.62, easing: "ease-out" },
                { transform: 'rotate3d(1,0,0,-60deg) translateY(-50rem)', zIndex: 3, offset: 0.8 },
                { transform: 'rotate3d(1,0,0,-60deg) translateY(-50rem)', zIndex: 3, offset: 1 },
            ], {
            duration: 7200,
            iterations: Infinity
        }
        )
        this.$refs.paper.animate(
            [
                { transform: 'translateY(120rem)', color: '#909090', opacity: 0, offset: 0, easing: "ease-out" },
                { opacity: 1, offset: 0.1 },
                { transform: 'translateY(240rem)', color: '#909090', offset: 0.15, easing: "ease-in-out" },
                { transform: 'translateY(70rem)', color: '#909090', offset: 0.3 },
                //出纸结束
                { transform: 'translateY(70rem)', color: '#909090', offset: 0.48 },
                { transform: 'translateY(70rem)', color: 'transparent', offset: 0.5 },
                //翻转结束
                { transform: 'translateY(70rem)', color: 'transparent', offset: 0.62, easing: "ease-out" },
                { transform: 'translateY(-20rem)', color: 'transparent', offset: 0.8, easing: "ease-in-out" },
                { transform: 'translateY(0rem)', color: 'transparent', offset: 0.9 },
                { opacity: 1, offset: 0.93 },
                { opacity: 0, offset: 0.99 },
                { transform: 'translateY(0rem)', color: 'transparent', opacity: 0, offset: 1 },
            ], {
            duration: 7200,
            iterations: Infinity
        }
        );
    },
}
</script>
<style>
.flip-animation {
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

.animation {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 360rem;
    perspective: 1000px;
}

.paperbox {
    width: 100%;
    height: 280rem;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
}

.paper {
    background-color: #FFFAF8;
    transform-origin: center;
    height: 120rem;
    width: 96rem;
    color: #909090;
    font-size: 25rem;
    line-height: 29rem;
    padding: 0 0 0 11rem;
    box-sizing: border-box;
    text-align: left;
    white-space: wrap;
    overflow-wrap: break-word;
}

.printer {
    width: 100%;
    height: 240rem;
    position: absolute;
    left: -2rem;
    box-sizing: border-box;
    top: 60rem;
    z-index: 2;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDQwIDQ5NiA1NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5NiA0OTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cmVjdCB4PSIxMDQiIHk9IjE2MCIgc3R5bGU9ImZpbGw6IzJGNDIzRjsiIHdpZHRoPSIyODgiIGhlaWdodD0iMTM2IiAvPjxwYXRoIHN0eWxlPSJmaWxsOiM0QzUyNTQ7IiBkPSJNNDk2LDQwMS42YzAsNDQuOC0zNS4yLDQ2LjQtODAuOCw0Ni40SDgwLjhDMzUuMiw0NDgsMCw0NDcuMiwwLDQwMS42VjMxMmMwLTQ0LjgsMzUuMi04MCw4MC44LTgwSDQxNmM0NC44LDAsODAsMzQuNCw4MCw4MFY0MDEuNnoiIC8+PHBhdGggc3R5bGU9ImZpbGw6IzJGNDIzRjsiIGQ9Ik04MCwyMzJoMzM1LjJjNDUuNiwwLDgwLjgsMzQuNCw4MC44LDgwdjg5LjZjMCw0NC44LTM1LjIsNDYuNC04MC44LDQ2LjQiIC8+PHBhdGggc3R5bGU9ImZpbGw6IzMyQkE3QzsiIGQ9Ik0zODQsNDQ1LjZjMCwxMC40LTgsMTguNC0xOC40LDE4LjRIMTM4LjRjLTEwLjQsMC0xOC40LTgtMTguNC0xOC40di0zLjJjMC0xMC40LDgtMTguNCwxOC40LTE4LjRoMjI3LjJjMTAuNCwwLDE4LjQsOCwxOC40LDE4LjRMMzg0LDQ0NS42TDM4NCw0NDUuNnoiIC8+PHBhdGggc3R5bGU9ImZpbGw6IzBBQTA2RTsiIGQ9Ik0zODQsNDQ1LjZMMzg0LDQ0NS42YzAsMTAuNC04LjgsMTguNC0xOC40LDE4LjRIMTM4LjRjLTEyLjgsMC0xOC40LTgtMTguNC0xOC40bDAsMCIgLz48Y2lyY2xlIHN0eWxlPSJmaWxsOiMzMkJBN0M7IiBjeD0iNDMzLjYiIGN5PSIzNzMuNiIgcj0iMjAuOCIgLz48cGF0aCBzdHlsZT0iZmlsbDojMEFBMDZFOyIgZD0iTTQ0OC44LDM1OC40YzgsOCw4LDIxLjYsMCwyOS42cy0yMS42LDgtMjkuNiwwIiAvPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMyRjQyM0Y7IiBkPSJNMTE3LjYsMzY4YzAsNC44LTQsOC04LDhINTJjLTQuOCwwLTgtMy4yLTgtOGwwLDBjMC00LjgsNC04LDgtOGg1Ny42CUMxMTMuNiwzNjAsMTE3LjYsMzYzLjIsMTE3LjYsMzY4TDExNy42LDM2OHoiIC8+PHBhdGggc3R5bGU9ImZpbGw6IzJGNDIzRjsiIGQ9Ik0xMTcuNiwzMzZjMCw0LjgtNCw4LTgsOEg1MmMtNC44LDAtOC0zLjItOC04bDAsMGMwLTQuOCw0LTgsOC04aDU3LjYJQzExMy42LDMyOCwxMTcuNiwzMzEuMiwxMTcuNiwzMzZMMTE3LjYsMzM2eiIgLz48cGF0aCBzdHlsZT0iZmlsbDojMkY0MjNGOyIgZD0iTTExNy42LDQwMGMwLDQuOC00LDgtOCw4SDUyYy00LjgsMC04LTMuMi04LThsMCwwYzAtNC44LDQtOCw4LThoNTcuNglDMTEzLjYsMzkyLDExNy42LDM5NS4yLDExNy42LDQwMEwxMTcuNiw0MDB6IiAvPjwvZz48cmVjdCB4PSIxMDQiIHk9IjI0OCIgc3R5bGU9ImZpbGw6IzNGNjI1RjsiIHdpZHRoPSIyODgiIGhlaWdodD0iNDAiIC8+PC9zdmc+")
}
</style>