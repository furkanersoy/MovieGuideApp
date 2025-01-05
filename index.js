let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");

let getMovie = async () => {
    let movieName = movieNameRef.value;
    let url = `https://www.omdbapi.com/?t=${movieName}&apikey=${key}`;

    if (movieName.length <= 0) {
        result.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
    } else {
        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data.Response === "True") {
                result.innerHTML = `
                    <div class="info result-animate">
                        <img src=${data.Poster} class="poster">
                        <div>
                            <h2>${data.Title}</h2>
                            <div class="rating">
                                <img src="star-icon.svg">
                                <h4>${data.imdbRating}</h4>
                            </div>
                            <div class="details">
                                <span>${data.Rated}</span>
                                <span>${data.Year}</span>
                                <span>${data.Runtime}</span>
                            </div>
                            <div class="genre">
                                <div>${data.Genre.split(",").join("</div><div>")}</div>
                            </div>
                        </div>
                    </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p>
                    <button id="watch-later-btn">Watch Later</button>
                `;

            
                document.getElementById("watch-later-btn").addEventListener("click", () => {
                    addToWatchLater(data.Title, data.Poster);
                });
            } else {
                result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
            }
        } catch (error) {
            result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
        }
    }
};


function addToWatchLater(title, poster) {
    let watchLaterList = JSON.parse(localStorage.getItem("watchLaterList")) || [];

    if (watchLaterList.some(movie => movie.title === title)) {
        alert(`${title} is already on your watch later list.`);
        return;
    }

    watchLaterList.push({ title, poster });
    localStorage.setItem("watchLaterList", JSON.stringify(watchLaterList));
    alert(`${title} is succesfully added to watch later list.`);
}

function showWatchLaterList() {
    let watchLaterList = JSON.parse(localStorage.getItem("watchLaterList")) || [];

    if (watchLaterList.length === 0) {
        result.innerHTML = `<h3 class="msg">Watch Later list is empty.</h3>`;
        return;
    }

    let watchLaterHTML = `<h3>Watch Later List</h3>`;
    watchLaterList.forEach((movie, index) => {
        watchLaterHTML += `
            <div class="watch-later-item" id="movie-${index}">
                <img src="${movie.poster}" class="poster-small">
                <p>${movie.title}</p>
                <button class="remove-btn" onclick="removeFromWatchLater(${index})">Delete</button>
            </div>
        `;
    });

    result.innerHTML = watchLaterHTML;
}


function removeFromWatchLater(index) {
    let watchLaterList = JSON.parse(localStorage.getItem("watchLaterList")) || [];
    let movieElement = document.getElementById(`movie-${index}`);


    movieElement.classList.add("fade-out");

    setTimeout(() => {

        watchLaterList.splice(index, 1);
        localStorage.setItem("watchLaterList", JSON.stringify(watchLaterList));


        showWatchLaterList();
    }, 500); 
}

searchBtn.addEventListener("click", getMovie);

let watchLaterViewBtn = document.createElement("button");
watchLaterViewBtn.textContent = "Show Watch Later List";
watchLaterViewBtn.id = "watch-later-view-btn";
watchLaterViewBtn.addEventListener("click", showWatchLaterList);
document.body.appendChild(watchLaterViewBtn);