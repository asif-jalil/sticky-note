const filterInput = document.querySelector("#filterInput");
const tweetContainer = document.querySelector("#tweetContainer");
const tweetForm = document.querySelector("#tweetForm");
const hiddenData = document.querySelector("#hiddenData");
const tweetInput = document.querySelector("#tweetInput");
const charCount = document.querySelector("#charCount");
const addBtn = document.querySelector("#addBtn");
const actionAlert = document.querySelector("#actionAlert");
const emptyAlert = document.querySelector("#emptyAlert");
let tweetList;
let updateBtn;

let tweetData = [];

function loadListeners() {
    tweetInput.addEventListener("keyup", (e) => {
        const textLength = e.target.value.length;
        charCount.textContent = textLength;
    });
    
    filterInput.addEventListener("keyup", (e) => {
        tweetContainer.innerHTML = "";
        if (!emptyAlert.classList.contains("d-none")) {
            emptyAlert.classList.add("d-none");
            tweetContainer.classList.remove("d-none");
        }
    
        const filterText = e.target.value.trim();
        const filteredTweet = tweetData.filter((tweet) => {
            const tweetTextContent = tweet.tweet.toLowerCase();
            if (filterText === "") {
                return tweet;
            } else if (tweetTextContent.includes(filterText)) {
                // console.log(tweetTextContent.indexOf(filterText));
                return tweet;
            }
        });
    
        // // if (filterText.length > 0 && filteredTweet.length > 0) {
        //     const filterTextIndex = filteredTweet.map((tweet) => {
        //         const tweetTextContent = tweet.tweet.toLowerCase();
        //         // const tweetTextContentArray = Array.from(tweetTextContent);
        //         // return tweetTextContentArray.map((ch, index) => {
        //         //     if (filterText.includes(ch)) {
        //         //         return index;
        //         //     }
        //         // }).filter(i => !!i)
        //         return tweetTextContent.indexOf(filterText);
        //     });
    
            // const filteredIds = filteredTweet.map((tweet) => tweet.id);
            // const tweetListArray = Array.from(tweetList);
            // filteredIds.forEach((id, index) => {
            //     const filteredEl = tweetListArray.find((el) => el.id.includes(id));
            //     let elTextContent = filteredEl.children[0].children[0].children[0].innerText.toLowerCase();
            //     let editedElTextContent = elTextContent.replaceAll(filterText, `<span>${filterText}</span>`)
            //     filteredEl.children[0].children[0].children[0].innerHTML = editedElTextContent
            //     console.log(filteredEl.children[0].children[0].children[0].innerHTML );
            // })
    
        // }
    
        if (filteredTweet.length < 1) {
            emptyAlert.classList.remove("d-none");
            tweetContainer.classList.add("d-none");
        } else {
            showData(filteredTweet);
        }
    
        // const tweetListArray = Array.from(tweetList);
        // const filteredEl = tweetListArray.filter(el => {
        //     const elTextContent = el.children[0].children[0].children[0].innerText.toLowerCase();
        //     if (filterText === "") {
        //         return false;
        //     } else if (!elTextContent.includes(filterText)) {
        //         console.log(elTextContent.indexOf(filterText))
        //         return el;
        //     }
        // })
        // filteredEl.forEach(el => {
        //     el.remove()
        // })
    });

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
                read: false
            };
            tweetForm.reset();
            tweetData.push(newTweet);
            localStorage.setItem("tweetList", JSON.stringify(tweetData));
            displayItem(newTweet);
            actionMsg("success", "Successfully Added A Note");
        }
    });

    tweetContainer.addEventListener('click', e => {
        if (e.target.closest(".btn-check") === null) {
            return false;
        }
    
        const markReadCheck = e.target.closest(".btn-check");
        const markReadCheckId = Number(markReadCheck.id.split('-')[1]);
        let tweetItem = tweetData.find(tweet => tweet.id == markReadCheckId)
        let markReadLi = e.target.closest(".tweet-item")
        let markReadP = markReadCheck.previousElementSibling.previousElementSibling.children[0]
        let markReadText = markReadP.textContent
        if (markReadCheck.checked) {
            tweetData = tweetData.map(tweet => {
                if (tweet.id === markReadCheckId) {
                    return {
                        ...tweet,
                        read: true
                    }
                } else {
                    return tweet;
                }
            })
            localStorage.setItem('tweetList', JSON.stringify(tweetData));
            let markReadLine = `<del>${markReadText}</del>`;
            markReadP.innerHTML = markReadLine
        } else {
            tweetData = tweetData.map(tweet => {
                if (tweet.id === markReadCheckId) {
                    return {
                        ...tweet,
                        read: false
                    }
                } else {
                    return tweet;
                }
            })
            localStorage.setItem('tweetList', JSON.stringify(tweetData));
            let markReadLine = `${markReadText}`;
            markReadP.innerHTML = markReadLine
        }
    })

    window.addEventListener('DOMContentLoaded', () => {
        loadFromLocalStorage()
    })
}

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
    if (item.read) {
        li.innerHTML = `
            <div class="tweet-details me-2">
                <div class="tweet-text">
                    <p><del>${item.tweet}</del></p>
                </div>
                <p class="tweet-time">${moment(item.time).fromNow()}</p>
                <input class="btn-check" type="checkbox" checked id="readMark-${item.id}">
                <label class="inline-btn" for="readMark-${item.id}"><i class="fas fa-check"></i> Mark as read</label>
            </div>
            <div class="action-button-wrapper">
                <button class="edit-tweet" onclick="editTweet(${item.id})">Edit</button>
                <button class="delete-tweet" onclick="deleteTweet(${item.id})">Delete</button>
            </div>
        `;
    } else {
        li.innerHTML = `
            <div class="tweet-details me-2">
                <div class="tweet-text">
                    <p>${item.tweet}</p>
                </div>
                <p class="tweet-time">${moment(item.time).fromNow()}</p>
                <input class="btn-check" type="checkbox" id="readMark-${item.id}">
                <label class="inline-btn" for="readMark-${item.id}"><i class="fas fa-check"></i> Mark as read</label>
            </div>
            <div class="action-button-wrapper">
                <button class="edit-tweet" onclick="editTweet(${item.id})">Edit</button>
                <button class="delete-tweet" onclick="deleteTweet(${item.id})">Delete</button>
            </div>
        `;
    }
    
    tweetContainer.insertAdjacentElement("afterbegin", li);
    charCount.textContent = 0;
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
        if (text.length > 50) {
            callback("You have entered more than 120 character");
            return false;
        } else {
            return true;
        }
    }
}

function deleteTweet(id) {
    tweetData = tweetData.filter((tweet) => tweet.id !== id);
    localStorage.setItem("tweetList", JSON.stringify(tweetData));

    const tweetListArray = Array.from(tweetList);
    const targetTweet = tweetListArray.find((node) => node.id.includes(id));
    tweetContainer.removeChild(targetTweet);
    actionMsg("delete", "Your tweet has been deleted");

    tweetList = document.querySelectorAll(".tweet-item");

    if (!tweetData.length) {
        emptyAlert.classList.remove("d-none");
        tweetContainer.classList.add("d-none");
    }
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
                time,
            };

            const restTweet = tweetData.filter((tweet) => tweet.id !== targetTweet.id);
            tweetData = [...restTweet, newTweet];
            localStorage.setItem("tweetList", JSON.stringify(tweetData));

            const tweetListArray = Array.from(tweetList);
            const targetNode = tweetListArray.find((node) => node.id.includes(targetTweet.id));
            tweetContainer.removeChild(targetNode);
            displayItem(newTweet);
            actionMsg("success", "Successfully Updated A Note");

            tweetForm.reset();
            updateBtn.remove();
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

    updateTweet(targetTweet);
}

loadListeners()
