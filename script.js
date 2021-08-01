const filterInput = document.querySelector("#filterInput");
const tweetContainer = document.querySelector("#tweetContainer");
const tweetForm = document.querySelector("#tweetForm");
const hiddenData = document.querySelector("#hiddenData");
const tweetInput = document.querySelector("#tweetInput");
const charCount = document.querySelector("#charCount");
const addBtn = document.querySelector("#addBtn");
// const updateBtn = document.querySelector("#updateBtn");
const actionAlert = document.querySelector("#actionAlert");
const emptyAlert = document.querySelector("#emptyAlert");
let tweetList;
let updateBtn;

let tweetData = [];

tweetInput.addEventListener("keyup", (e) => {
    const textLength = e.target.value.length;
    charCount.textContent = textLength;
});

function loadFromLocalStorage() {
    const localData = JSON.parse(localStorage.getItem("tweetList"));
    if (localData) {
        tweetData = [].concat(localData);
    } else {
        tweetData = [];
    }
    showData(tweetData);
}

function displayItem(item) {
    if (tweetData.length <= 1) {
        emptyAlert.classList.add("d-none");
        tweetContainer.classList.remove("d-none");
    }

    const li = document.createElement("li");
    li.className = "d-flex tweet-item";
    li.id = `tweet-${item.id}`;
    li.innerHTML = `
        <div class="tweet-details me-2">
            <div class="tweet-text">
                <p>${item.tweet}</p>
            </div>
            <p class="tweet-time">${moment(item.time).fromNow()}</p>
        </div>
        <div class="action-button-wrapper">
            <button class="edit-tweet" onclick="editTweet(${item.id})">Edit</button>
            <button class="delete-tweet" onclick="deleteTweet(${item.id})">Delete</button>
        </div>
  `;
    tweetContainer.insertAdjacentElement("afterbegin", li);
    tweetList = document.querySelectorAll(".tweet-item");
}

function showData(data) {
    if (data.length) {
        data.forEach((tw) => {
            displayItem(tw);
        });
    } else {
        emptyAlert.classList.remove("d-none");
        tweetContainer.classList.add("d-none");
    }
}

function actionMsg(type, msg) {
    const toastEl = document.querySelector(".toast");
    let icon = "";
    toastEl.className = `toast align-items-center ${type}`;
    if (type === "success") {
        icon = `<i class="fas fa-check-circle"></i>`;
    } else if (type === "error") {
        icon = `<i class="fas fa-times-circle"></i>`;
    } else if (type === "delete") {
        icon = `<i class="fas fa-trash-alt"></i>`;
    }

    actionAlert.innerHTML = icon + msg;

    const toast = new bootstrap.Toast(toastEl, {
        delay: 5000,
    });
    toast.show();
}

function checkValidity(text, callback) {
    if (text === "") {
        callback("Error! You must write something");
        return false;
    } else {
        if (text.length > 120) {
            callback("You have entered more than 120 character");
            return false;
        } else {
            return true;
        }
    }
}

addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const tweet = tweetInput.value;
    let isValidate = checkValidity(tweet, (payload) => {
        payload && actionMsg("error", payload);
    });

    if (isValidate) {
        const time = moment();
        const allId = tweetData.map((tweet) => tweet.id);
        const id = allId.length ? Math.max(...allId) + 1 : 0;
        const newTweet = {
            id,
            tweet,
            time,
        };
        tweetForm.reset();
        tweetData.push(newTweet);
        localStorage.setItem("tweetList", JSON.stringify(tweetData));
        displayItem(newTweet);
        actionMsg("success", "Successfully updated tweet");
    }
});

function deleteTweet(id) {
    tweetData = tweetData.filter((tweet) => tweet.id !== id);
    localStorage.setItem("tweetList", JSON.stringify(tweetData));

    const tweetListArray = Array.from(tweetList);
    const targetTweet = tweetListArray.find((node) => node.id.includes(id));
    tweetContainer.removeChild(targetTweet);
    actionMsg("delete", "Your tweet has been deleted");

    tweetList = document.querySelectorAll(".tweet-item");
}

function updateTweet(targetTweet) {
    updateBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const tweet = tweetInput.value.trim();
        const time = moment();
        const isValidate = checkValidity(tweet, (payload) => {
            payload && actionMsg("error", payload);
        });

        if (isValidate) {
            const newTweet = {
                ...targetTweet,
                tweet,
                time
            };

            const restTweet = tweetData.filter((tweet) => tweet.id !== targetTweet.id);
            tweetData = [...restTweet, newTweet];
            console.log(tweetData);
            localStorage.setItem("tweetList", JSON.stringify(tweetData));

            const tweetListArray = Array.from(tweetList);
            const targetNode = tweetListArray.find((node) => node.id.includes(targetTweet.id));
            tweetContainer.removeChild(targetNode);
            displayItem(newTweet);

            tweetForm.reset();
            updateBtn.remove()
            addBtn.setAttribute("type", "submit");
            addBtn.classList.remove("d-none");
        }
    });
}

function editTweet(id) {
    updateBtn && updateBtn.remove();

    const targetTweet = tweetData.find((tweet) => tweet.id === id);
    tweetInput.value = targetTweet.tweet;

    addBtn.setAttribute("type", "button");
    addBtn.classList.add("d-none");

    let updateBtnElement = document.createElement("button");
    updateBtnElement.className = "ms-2";
    updateBtnElement.id = "updateBtn";
    updateBtnElement.textContent = "Update";
    addBtn.insertAdjacentElement("afterend", updateBtnElement);
    updateBtn = document.querySelector("#updateBtn");

    updateTweet(targetTweet)    
}

loadFromLocalStorage();
