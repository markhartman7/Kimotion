const kinect_recording = () => {

    console.log('Using Kinect recording data source');

    var i     = 0;
    var step  = conf.kinect.res.width * conf.kinect.res.height;

    var depth = new Uint16Array(step);
    var recording = new Uint16Array(depth.length);

    function read() {
        return depth;
    }

    function send_message() {
        console.log('Attempted to send message to recording, ignored.');
    }

    setInterval(update_frame, 1000/30);

    function update_frame() {
        depth = new Uint16Array(recording.subarray(i, i + step));
        i += step;
        i %= recording.length;
    }

    function fetch_recording(name) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', name, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            if (this.status === 200) {
                console.log(`successfully fetched recording ${name}`);
                i = 0;
                recording = new Uint16Array(this.response);
            }
            else {
                throw new Error(`non-200 response code on recording GET for ${name}`);
            }
        };

        xhr.onerror = function() {
            throw new Error(`failed to load recording ${name}`);
        };

        xhr.send();
    }

    fetch_recording('/general_movement.bin');

    return {
        read,
        send_message
    };
};
