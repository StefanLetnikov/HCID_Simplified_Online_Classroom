const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const muteElem = document.getElementById("mute");

const whiteboardElem = document.getElementById("whiteboard");
const annotateElem = document.getElementById("annotate");
const whiteboard_partElem = document.getElementById("whiteboard_part");
const whiteboard_btnsElem = document.getElementById("whitboard_btns");

const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};




startElem.addEventListener("click", (evt) => {
    sharingScreen();
}, false);

console.log = (msg) => logElem.innerHTML += `${msg}<br>`;
console.error = (msg) => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = (msg) => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = (msg) => logElem.innerHTML += `<span class="info">${msg}</span><br>`;


share_screen_iconElem = document.getElementById("share_screen_icon");

function sharingScreen() {
    if (share_screen_iconElem.className == "bi bi-projector") {
        startCapture();
        share_screen_iconElem.className = "bi bi-projector-fill";


        // document.getElementById("start").style.background = red;
    } else if (share_screen_iconElem.className == "bi bi-projector-fill") {
        stopCapture();
        share_screen_iconElem.className = "bi bi-projector";

        // document.getElementById("start").style.background = ;
    }
}

async function startCapture() {
    logElem.innerHTML = "";

    try {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    } catch (err) {
        console.error(`Error: ${err}`);
    }
}


function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();

    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
}

function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];

    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

mic_IconElem = document.getElementById("mute_icon");
// function Mute_Unmute() {
//     if (document.getElementById("mute").innerHTML === "Unmute") {
//         getLocalStream();
//         document.getElementById("mute").innerHTML = "Mute";
//     } else {
//         document.getElementById("mute").innerHTML = "Unmute";
//     }
// }

// rabote so ikonicki namesto so tekst
function Mute_Unmute() {
    if (mic_IconElem.className == "bi bi-mic-mute") {
        getLocalStream();
        mic_IconElem.className = "bi bi-mic";
    } else {
        mic_IconElem.className = "bi bi-mic-mute";
    }
}



function getLocalStream() {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then((stream) => {
        whiteboardElem.localStream = stream;
        whiteboardElem.localAudio.srcObject = stream;
        whiteboardElem.localAudio.autoplay = true;
    }).catch((err) => {
        console.error(`you got an error: ${err}`)
    });
}

//whiteboard
const canvas = document.getElementById("canvas")

canvas.height = 600;
canvas.width = 1350;

const ctx = canvas.getContext("2d");

let prevX = null;
let prevY = null;

ctx.lineWidth = 5;

let draw = false;

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs);
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr;
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})


let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("imag/png")
    let a = document.createElement("a")
    a.href = data
    a.download = "sketch.png"
    a.click()
})


pen_iconElem = document.getElementById("pen_icon");
annotateElem.addEventListener("click", (evt) => {
    if(pen_iconElem.className == "bi bi-pencil"){
        whiteboard_partElem.style.display = "block";
        whiteboard_btnsElem.style.display = "block";
        videoElem.style.display = "none"

        whiteboard_partElem.addEventListener("mousedown", (e) => draw = true);
        whiteboard_partElem.addEventListener("mouseup", (e) => draw = false);
        pen_iconElem.className = "bi bi-pencil-fill";
        //annotateElem.innerHTML = "Stop Drawing";
    }
    else if(pen_iconElem.className == "bi bi-pencil-fill"){

        whiteboard_partElem.style.display = "none";
        whiteboard_btnsElem.style.display = "none";
        videoElem.style.display = "block"

        whiteboard_partElem.addEventListener("mousedown", (e) => draw = false);
        whiteboard_partElem.addEventListener("mouseup", (e) => draw = false);
        pen_iconElem.className = "bi bi-pencil";
        //annotateElem.innerHTML = "Annotate";
    }
}, false);



window.addEventListener("mousemove", (e) => {
    let rect = e.target.getBoundingClientRect();
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX ;
        prevX = prevX - rect.left;
        prevY = e.clientY ;
        prevY = prevY - rect.top;
        return
    }

    let currentX = e.clientX;
     currentX = currentX - rect.left;
    let currentY = e.clientY;
     currentY = currentY - rect.top;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
})

