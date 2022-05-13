<template>
	<div class="button-frame">
		<div class="animated-button" ref="button" v-bind:class="{ active: active, disabled: disabled }" @click.stop="clicked">
			<div class="spinner" v-bind:class="{ hide: !active }"></div>
			<span v-bind:class="{ hide: active }">
				<slot></slot>
			</span>
			<div class="button-text" v-bind:class="{ hide: active }">{{ text }}</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	props: [
		"text",
		"active",
		"disabled",
	],
	methods: {
		clicked() {
			if (!this.disabled && !this.active) {
				this.$emit("click", "clicked!");
			}
		},
	},
};
</script>
<style scoped>
.button-frame {
	overflow: hidden;
}

.hide {
	opacity: 0;
}

.animated-button {
	padding: 8rem 15rem;
	overflow: hidden;
	box-sizing: border-box;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	transition: all ease-out 250ms;
}

.animated-button>div {
	transition: all ease-out 250ms;
}

.button-text {
	color: white;
	transform-origin: center;
	transform: scale(1);
}

.button-text.hide {
	transform: scale(0.85);
}


.spinner {
	background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGcgY2xhc3M9InNwaW5uZXIiPjxjaXJjbGUgY2xhc3M9InBhdGgiIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSI3Ij48L2NpcmNsZT48L2c+PHN0eWxlPi5zcGlubmVye2FuaW1hdGlvbjpyb3RhdGUgMi4zcyBsaW5lYXIgaW5maW5pdGU7dHJhbnNmb3JtLW9yaWdpbjpjZW50ZXI7fS5wYXRoe3N0cm9rZTojRkZGRkZGO3N0cm9rZS1saW5lY2FwOnJvdW5kO2FuaW1hdGlvbjpkYXNoIDEuOHMgZWFzZS1pbi1vdXQgaW5maW5pdGUgZm9yd2FyZHM7dHJhbnNmb3JtLW9yaWdpbjpjZW50ZXI7fUBrZXlmcmFtZXMgcm90YXRlezEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpO319QGtleWZyYW1lcyBkYXNoezAle3N0cm9rZS1kYXNoYXJyYXk6MTIsMTUwO3N0cm9rZS1kYXNob2Zmc2V0OjA7dHJhbnNmb3JtOnJvdGF0ZSgwZGVnKTt9NTAle3N0cm9rZS1kYXNoYXJyYXk6MTAwLDE1MDtzdHJva2UtZGFzaG9mZnNldDotMjU7dHJhbnNmb3JtOnJvdGF0ZSgwZGVnKTt9MTAwJXtzdHJva2UtZGFzaGFycmF5OjEwMCwxNTA7c3Ryb2tlLWRhc2hvZmZzZXQ6LTExNDt0cmFuc2Zvcm06cm90YXRlKDMzZGVnKTt9fTwvc3R5bGU+PC9zdmc+");
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;
	width: 100%;
	position: absolute;
	height: 32rem;
	transform: scale(1);
}

.spinner.hide {
	transform: scale(1.5)
}

.animated-button.disabled,
.animated-button.active {
	opacity: 0.5;
}

.animated-button>div:not(.critical-mask) {
	/* transform: skewX(15deg); */
	white-space: nowrap;
	transform-origin: center;
}
</style>
