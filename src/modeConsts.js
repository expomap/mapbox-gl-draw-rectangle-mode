const doubleClickZoom = {
    enable: function enable(ctx) {
        setTimeout(function () {
            // First check we've got a map and some context.
            if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) { 
                return; 
            }

            // Now check initial state wasn't false (we leave it disabled if so)
            if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) { 
                return; 
            }
            ctx.map.doubleClickZoom.enable();
        }, 0);
    },
    disable: function disable(ctx) {
        setTimeout(function () {
            if (!ctx.map || !ctx.map.doubleClickZoom) { 
                return; 
            }

            // Always disable here, as it's necessary in some cases.
            ctx.map.doubleClickZoom.disable();
        }, 0);
    }
};

function isEscapeKey(e) {
    return e.keyCode === 27;
}
  
function isEnterKey(e) {
    return e.keyCode === 13;
}

export {
	doubleClickZoom, isEscapeKey, isEnterKey
};