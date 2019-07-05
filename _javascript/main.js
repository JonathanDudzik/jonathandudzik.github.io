/***************************************
* Container
**************************************/
class Container {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.children = [];
    }
    
    add(child) {
        this.children.push(child);
        return child;
    }
    
    remove(child) {
        this.children = this.children.filter(c => c !== child);
        return child;
    }
    
    update () {
        this.children = this.children.filter(child => {
            if (child.update) {
                child.update(); //there was a "this" as a parameter...
            }
            return child.dead ? false : true;
        });
    }
}

/********************************************************
* CanvasRenderer.js
********************************************************/
class CanvasRenderer {
    constructor(w, h) {
        const canvas = document.createElement("canvas");
        this.w = canvas.width  = w;
        this.h = canvas.height = h;
        this.view = canvas;
        this.ctx = canvas.getContext("2d");
    }

    render(container, clear = true) {
        const { ctx } = this;
        function renderRec(container) {
            container.children.forEach(child => {
                if(child.visible == false) {
                    return;
                }
                ctx.save();
                
                if(child.pos) {
                    ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
                }

                if(child.text) {
                    const { font, fill, align } = child.style;
                    if(font) ctx.font = font
                    if(fill) ctx.fillStyle = fill;
                    if(align) ctx.textAlign = align;
                    ctx.fillText(child.text, 0, 0);
                } else if(child.texture) {
                    ctx.drawImage(child.texture.img, 0, 0);
                }

                if(child.chilren) {
                    renderRec(child);
                }
                ctx.restore();
            })
        }
        if(clear) {
            ctx.clearRect(0, 0, this.w, this.h);
        }
        renderRec(container);
    }
}

/********************************************************
* classes of leaf nodes (game entities/models)
********************************************************/
class Text {
    constructor(text = "", style = {}) {
        this.pos = { x: 0, y: 0 };
        this.text = text;
        this.style = style;
    }
}

class Texture {
    constructor (url) {
        this.img = new Image();
        this.img.src = url; 
    }
}

class Sprite {
    constructor(texture) {
        this.texture = texture;
        this.pos = { x: 0, y: 0 };
        this.visible = true;
    }
}

{
// class Sound {
//     constructor(url) {
//         this.track = new Audio();
//         this.track.src = url;
//         this.update = function() {
//             this.track.pause();
//             this.track.currentTime = 0;
//         }
//     }
// }
}

/***************************************
* Set-up code
**************************************/
const w = 960;
const h = 720;
const renderCanvas = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderCanvas.view);

/***************************************
* Portal Objects
**************************************/
const scene = new Container();
const textures = {
    background: new Texture("./media/background.jpg"),
    texture1: new Texture("./media/Slide1.JPG"),
    texture2: new Texture("./media/Slide2.JPG"),
    texture3: new Texture("./media/Slide3.JPG"),
    texture4: new Texture("./media/Slide4.JPG"),
}

// render background
scene.add(new Sprite(textures.background));

// render images
const slide1 = new Sprite(textures.texture1);
slide1.update = function() {
    console.log('updated slide1!');
    slide1.visible = false;
    slide1.dead = true;
}
const slide2 = new Sprite(textures.texture2);
slide2.update = function() {
    console.log('updated slide2!');
    slide2.visible = false;
    slide2.dead = true;
}
const slide3 = new Sprite(textures.texture3);
slide3.update = function() {
    console.log('updated slide3!');
    slide3.visible = false;
    slide3.dead = true;
}
const slide4 = new Sprite(textures.texture4);
slide4.update = function() {
    console.log('updated slide4!');
    slide4.visible = false;
    slide4.dead = true;
}

scene.add(slide1);
scene.add(slide2);
scene.add(slide3);
scene.add(slide4);


{
// // Start animation loop
// function loopy() {
// //   requestAnimationFrame(loopy);

//   // Update everything
//   scene.update();

//   // Render everything
//   renderCanvas.render(scene);
// }
// requestAnimationFrame(loopy);
}

{
// const texture2 = new Texture("./media/Slide2.JPG");
// const texture3 = new Texture("./media/Slide3.JPG");
// const texture4 = new Texture("./media/Slide4.JPG");
// const slide2 = new Sprite(texture2);
// const slide3 = new Sprite(texture3);
// const slide4 = new Sprite(texture4);

// const audio1 = new Sound('./media/test-audio.mp3');
// const audio2 = new Sound('./media/test-audio2.mp3');
// const audio3 = new Sound('./media/test-audio2.mp3');
// const audio4 = new Sound('./media/test-audio2.mp3');

// scene.add(audio1);
// scene.add(audio2);
// scene.add(audio3);
// scene.add(audio4);

// const pauseBtn = document.getElementById('pause');
// pauseBtn.addEventListener('click', () => {
//     audio1.track.pause();
//     audio2.track.pause();
//     audio3.track.pause();
//     audio4.track.pause();
// })
}

/***************************************
* Side-menu hiding/unhiding sections
**************************************/
// get all elements as an array that will act as a selector
const selectors = Array.from(document.querySelectorAll('[data-selector]'));

// give each selector an event listener
selectors.forEach(function(selector) {
    selector.addEventListener('click', toggleSections);
});

function toggleSections(e) {
    
    // selected section
    const sectionElement = document.querySelector(`section[data-section="${e.target.dataset.selector}"]`);
    
    // remove active class from all selectors
    selectors.forEach(function(selector) {
        selector.classList.remove('is-active');
    });
    
    // make current selector active class
    e.target.classList.add('is-active');

    {
    // if(`${e.target.dataset.selector}` == "welcome") {
    //     scene.update();
    //     scene.add(slide1);
    //     audio1.track.play();
    // } else if(`${e.target.dataset.selector}` == "2") {
    //     scene.update();
    //     scene.add(slide2);
    //     audio2.track.play();
    // } else if(`${e.target.dataset.selector}` == "3") {
    //     scene.update();
    //     scene.add(slide3);
    //     audio2.track.play();
    // } else if(`${e.target.dataset.selector}` == "4") {
    //     scene.update();
    //     scene.add(slide4);
    //     audio2.track.play();
    // }
    } 
    console.log(scene.children);
    scene.update();
    renderCanvas.render(scene);
    console.log(scene.children);
}