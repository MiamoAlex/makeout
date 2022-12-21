import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const log = (...msg) => {
    const li = document.createElement('li');
    li.textContent = msg.join(' ');
    document.querySelector('ul').appendChild(li);
    console.log(...msg)
};

const connect = (...e) => {
    log(...e)
}

document.querySelector('input[type="button"]').addEventListener('click', connect)