const conf_gui = (() => {
    let gui = new dat.GUI();

    let folder = gui.addFolder('Kimotion global settings');

    function get_ctrl(folder, prop_name) {
        let ctrl = _.where(folder.__controllers, { 'property': prop_name});
        try {
            return ctrl[0];
        } catch (e) {
            console.error(`Couldn't find requested datgui controller: ${prop_name}`);
        }
    }

    function update_remaining_time() {
        conf.timer.remaining -= conf.timer.tick;
    }

    function next_mod() {
        modctrl.next();
        conf.timer.remaining = conf.timer.duration; // make sure remaining doesn't go negative
    }

    folder.add(conf, 'server')
    .name('Server')
    .onChange(function (server_host) { localStorage.ws_url = server_host; });

    folder.add(conf, 'mods', conf.mods)
    .name('Mods')
    .onChange(modctrl.set);

    function timer_ctrl(enabled) {
        if (enabled) {
            conf.timer.remaining = conf.timer.duration;
            timer.start(
                conf.timer.duration,
                conf.timer.tick,
                update_remaining_time,
                next_mod
            );
        }
        else {
            timer.stop();
            conf.timer.remaining = conf.timer.duration;
        }
    }
    timer_ctrl(conf.timer.enabled);

    folder.add(conf.timer, 'enabled', conf.timer.enabled)
    .name('Cycle mods')
    .onChange(timer_ctrl);

    folder.add(conf.timer, 'duration', 0.1, 10)
    .name('Mins per mod')
    .onChange(function (new_dur) {
        if (conf.timer.enbled) {
            timer.start(new_dur, conf.timer.tick, update_remaining_time, modctrl.next);
        }
    });

    folder.add(conf, 'kinect_tilt', 0, 30)
    .name('Kinect Tilt')
    .onChange(input.send_message);

    folder.open();

    let mod_folder = gui.addFolder('Mod settings');

    mod_folder.open();

    // expose the mod config folder to mod authors
    conf.gui = mod_folder;

    // if the timer is enabled, assume this is sparkcon mode and close the gui
    if (conf.timer.enabled) {
        gui.close();
    }
})();
