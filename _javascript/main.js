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
    
    update (dt, t) {
        this.children = this.children.filter(child => {
            if (child.update) {
                child.update(dt, t, this); //why "this" as a parameter...
            }
            return child.dead ? false : true;
        });
    }
}


class Renderer {
    constructor(w, h) {
        const canvas = document.createElement("canvas");
        this.w = canvas.width = w;
        this.h = canvas.height = h;
        this.view = canvas;
        this.context = canvas.getContext("2d");
        this.context = canvas.textBaseline = "top";
    }

    render(container, clear = true) {
        container.children.forEach(child => {
            if(child.visible == false) {
                return;
            }
        
            const { context } = this;
            
            // Handle transforms
            if (child.pos) {
                ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
            }

            // Draw the leaf nodes
            if(child.text) {
                console.log("here is an text file:" + child.text);
            } 

            if (clear) {
                context.clearRect(0, 0, this.w, this.h);
            }
        });
    }
}

class Text {
    constructor(text = "", style = {}) {
        this.pos = { x: 0, y: 0 };
        this.text = text;
        this.style = style;
    }
}

/***************************************
 * Setup interface layout
**************************************/
const renderer = new Renderer(640, 380);
document.getElementById("board").appendChild(renderer.view);

const scene = new Container();
const lineOne = new Text("For we have thought", {
    font: "40pt Times New Roman",
    fill: "blue",
    align: "center"
});
lineOne.pos.x = 2;
lineOne.pos.y = 2;

scene.add(lineOne);

let dt = 0;
let last = 0;

function loopy (ms) {
  requestAnimationFrame(loopy);

  const t = ms / 1000; // Let's work in seconds
  dt = t - last;
  last = t;

}
requestAnimationFrame(loopy);



// For we have thought 
// the longer thoughts
// And gone the shorter way.
// And we have danced to devils’ tunes,
// Shivering home to pray;
// To serve one master in the night,
// Another in the day.