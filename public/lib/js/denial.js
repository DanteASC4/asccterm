document.addEventListener('DOMContentLoaded', e => {
    let t = document.getElementById('svgtext')
    console.log(t);
    let jaw = document.getElementsByClassName('bottom')[0];
    anime({
        targets: jaw,
        translateY: [-150, -50],
        keyframes: [
            {skewX: -15, duration: 20},
            {skewX: 15 , duration: 20},
            {skewX: -15, duration: 20},
            {skewX: 15 , duration: 20},
            {skewX: 0  , duration: 20},
        ],
        easing: 'cubicBezier(1,0,0,1.02)',
        direction: 'alternate',
        duration: 1000,
        loop: true,
    })
})
