class mod {
    constructor(gfx) {
        this.author  = '';
        this.title   = '';
        this.effects = [];
        this.gfx     = gfx;
        // gfx.set(this, '2d'); // default to 2d
    }
    update(gfx) {
        // update each effect in this.effects
        for( let i = 0, l = this.effects.length; i < l; ++i ) {
            this.effects[i].update(gfx);
        }
    }
    destroy(gfx) {
        // remove any datgui controllers that were created for this mod
        for (let i = gfx.conf.gui.__controllers.length - 1; i >= 0; i -= 1) {
            gfx.conf.gui.remove(gfx.conf.gui.__controllers[i]);
        }
    }
    add_effect(effect_name) {
        const effect_prop = `${effect_name}_effect`;
        let new_effect = new effects[effect_prop](this.gfx);
        this.effects.push(new_effect);
    }
}
