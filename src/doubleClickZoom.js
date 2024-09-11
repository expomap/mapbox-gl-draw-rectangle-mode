const doubleClickZoom = {
	enable: (ctx) => {
	    // First check we've got a map and some context.
	    if (
	        !ctx.map ||
	        !ctx.map.doubleClickZoom ||
	        !ctx._ctx ||
	        !ctx._ctx.store ||
	        !ctx._ctx.store.getInitialConfigValue
	    ){
			return;
		}

	    // Now check initial state wasn't false (we leave it disabled if so)
	    if (!ctx._ctx.store.getInitialConfigValue("doubleClickZoom")){
			return;
		} 
	    ctx.map.doubleClickZoom.enable();
	    
	},

	disable(ctx) {
	    if (!ctx.map || !ctx.map.doubleClickZoom){
			return;
		} 
	    // Always disable here, as it's necessary in some cases.
	    ctx.map.doubleClickZoom.disable();
	}  
};

export default doubleClickZoom;