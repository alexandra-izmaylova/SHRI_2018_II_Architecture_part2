import { Dispatcher } from './dispatcher.js';
import { Store } from './store.js';

const dispatcher = new Dispatcher();

class UserStore extends Store {
    constructor(dispatcher, initialState) {
        super(dispatcher, 'currentVideo', initialState);
    }

    processPayload(state, payload) {
        if(payload.action === 'expand') {
            return payload.id;
        }
        if(payload.action === 'collapse') {
            return null;
        }
        return state;
    }
}

let expandedVideoId = localStorage.expandedVideoId;

const userStore = new UserStore(dispatcher, expandedVideoId);
userStore.addListener((videoId) => {
    if (videoId) {
        expandPlayer(document.getElementById(videoId));
    } else {
        collapsePlayer(document.getElementById(expandedVideoId));
    }
    expandedVideoId = videoId;
});

userStore.addListener((videoId) => {
    localStorage.expandedVideoId = videoId;
});

function expandPlayer(video) {
    const element = video.parentElement;

    if (element.style.position === 'fixed') return;
    const position = element.getBoundingClientRect();
    const size = {
        width: window.getComputedStyle(element).width,
        height: window.getComputedStyle(element).height
    };

    element.style.transition = null;
    element.style.position = 'fixed';
    element.style.top = position.top + 'px';
    element.style.left = position.left + 'px';
    element.style.height = size.height;
    element.style.width = size.width;
    element.style.zIndex = '999';

    setTimeout(() => {
        element.style.transition = 'all 0.5s';
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = '100%';
        element.style.height = '100%';
    }, 100);

    setTimeout(() => element.classList.add('active'), 600);
}

function collapsePlayer(video) {
    const element = video.parentElement;
    if (!element.classList.contains('active')) return;
    element.classList.remove('active');
    const wrapper = element.parentElement;
    const position = wrapper.getBoundingClientRect();
    const size = {
        width: window.getComputedStyle(wrapper).width,
        height: window.getComputedStyle(wrapper).height
    };

    element.style.top = position.top + 'px';
    element.style.left = position.left + 'px';
    element.style.height = size.height;
    element.style.width = size.width;
    element.style.zIndex = '0';

    setTimeout(() => {
        element.style.position = 'static';
        element.style.transition = null;
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = '100%';
        element.style.height = '100%';
    }, 600);
}

let brightness = 100;
let contrast = 100;

function initButton(button, videoId) {
    button.addEventListener('click', () => {
        dispatcher.dispatch({ action: 'collapse', id: videoId });
    });
}

function initButtonBrightness(range, video, values) {
    range.addEventListener("input", function (event) {
        brightness = range.value;
        values.textContent = `Яркость: ${brightness / 2} %`;
        video.style.filter = 'brightness(' + brightness + '%) contrast(' + contrast + '%)';
    });

}

function initButtonContrast(range, video, values) {
    range.addEventListener("input", function (event) {
        contrast = range.value;
        values.textContent = `Контраст: ${contrast / 5} %`;
        video.style.filter = 'contrast(' + contrast + '%) brightness(' + brightness + '%)';
    });
}

function initVideo(video, url) {
    video.addEventListener('click', () => {
        dispatcher.dispatch({ action: 'expand', id: video.id });
    });
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }
}

var video1 = document.getElementById('video-1');
var video2 = document.getElementById('video-2');
var video3 = document.getElementById('video-3');
var video4 = document.getElementById('video-4');

initVideo(video1, 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');

initVideo(video2, 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');

initVideo(video3, 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');

initVideo(video4, 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');

initButton(document.getElementById('button-1'), video1.id);
initButton(document.getElementById('button-2'), video2.id);
initButton(document.getElementById('button-3'), video3.id);
initButton(document.getElementById('button-4'), video4.id);

initButtonBrightness(document.getElementById('brightness-1'),video1,document.getElementById('values-brightness-1'));
initButtonBrightness(document.getElementById('brightness-2'),video2,document.getElementById('values-brightness-2'));
initButtonBrightness(document.getElementById('brightness-3'),video3,document.getElementById('values-brightness-3'));
initButtonBrightness(document.getElementById('brightness-4'),video4,document.getElementById('values-brightness-4'));

initButtonContrast(document.getElementById('contrast-1'),video1,document.getElementById('values-contrast-1'));
initButtonContrast(document.getElementById('contrast-2'),video2,document.getElementById('values-contrast-2'));
initButtonContrast(document.getElementById('contrast-3'),video3,document.getElementById('values-contrast-3'));
initButtonContrast(document.getElementById('contrast-4'),video4,document.getElementById('values-contrast-4'));



window.onload = () => {
    const expandedVideo = document.getElementById(expandedVideoId);
    if (expandedVideo) {
        expandPlayer(expandedVideo);
    } 
};