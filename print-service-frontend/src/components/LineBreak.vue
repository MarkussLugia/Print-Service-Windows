<template>
	<div class="line-break">
		<span class="text"><slot></slot></span>
		<div class="hr-break-line"></div>
	</div>
</template>

<script>
</script>

<style scoped>
	.line-break {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 8rem 15rem 5rem;
		display: flex;
		align-items: center;
		justify-content: stretch;
		margin: 10rem 0 2rem;
	}

	.text {
		font-size: 21rem;
		line-height: 24rem;
		white-space: nowrap;
		flex-shrink: 0;
		flex-grow: 0;
		margin-right: 5rem;
		color: #A0A0A0;
		font-weight: bold;
		letter-spacing: 1rem;
	}

	.hr-break-line {
		flex-grow: 1;
		height: 0;
		border-top: 3.2rem dotted #A0A0A0;
	}
</style>
