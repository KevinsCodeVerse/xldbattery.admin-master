<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		created() {
			this.handleResize();
        	window.addEventListener('resize', this.handleResize)
		},
		mounted() {
			
		},

		methods:{
			handleResize (event) {
				var fullWidth = document.documentElement.clientWidth
				if(fullWidth > 768) {
					this.$store.state.isPhone = false;
					this.$store.state.navOpen = true;
				} else {
					this.$store.state.isPhone = true;
					this.$store.state.navOpen = false;
				}
			},
		}
	}
</script>


<style lang="scss">
	@import url("./assets/css/element-ui.css");
	@import url("./assets/css/public.css");
	@import url("./assets/fonts/icon.css");

	* {
		padding: 0;
		margin: 0;
	}

	body {
		 background-color: #f6f8f9;
		overflow: hidden;
		padding: 0 !important;
	}
	@media screen and (max-width: 768px) {
		.el-message-box {
			width: 80% !important;
		}
		.el-dialog {
			width: 80% !important;
		}
		.el-dialog .el-form-item__label {
			display: none !important;
		}
		.el-dialog .el-form-item__content {
			margin-left: 0 !important;
		}
		.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner,.el-date-editor.el-input,.el-date-editor.el-input__inner {
			width: 100% !important;
		}
		.el-date-range-picker {
			width: 80vw !important;
			// left: 10vw !important;
		}
		.el-date-range-picker .el-picker-panel__body {
			min-width: auto !important;
			display: flex !important;
			flex-wrap: wrap !important;
		}
		.el-date-range-picker .el-picker-panel__body .el-date-range-picker__content {
			width: 100% !important;
		}
		.el-form--inline .el-form-item,.el-form--inline .el-form-item__content,.el-select {
			display: block !important;
		}
	}

	// .theme-color:{
	// 	// color: $color-primary;
	// }
  	.page{
		text-align: right;
		margin-top: 20px;
	}
	.el-button--small {
		margin: 5px!important;
	}

	.el-form--label-top .el-form-item__label {
		line-height: 18px !important;
		font-weight: bold;
		padding: 0 !important;
		color: #999999 !important;
	}
	.el-radio,.el-checkbox {
		padding: 10px 0 !important;
	}
	
</style>
