document.addEventListener("DOMContentLoaded", function() {

  const baseUrl = "http://localhost:3000/toys/"

  const getToys = () => {
    fetch(baseUrl)
    .then(resp => resp.json())
    .then(toys => renderToys(toys))
  }

  const renderToys = (toys) => {
    for(let toy of toys) {
      createToy(toy)
    }
  }

  function createToy(toy){
    const toyDiv = document.getElementById('toy-collection')

    toyDiv.insertAdjacentHTML("beforeend", `
      <div data-id="${toy.id}" class="card">
        <h2>${toy.name}</h2>
        <img src=${toy.image} class="toy-avatar" />
        <p>${toy.likes} Likes </p>
        <button data-id="${toy.id}" class="like-btn">Like <3</button>
        <button data-id="${toy.id}" class="delete-btn">Delete :(</button>
      </div>
    `)
  }

  function clickHandler() {
    document.addEventListener("click", (e) => {
      const click = e.target
      const formContain = document.querySelector('.container')

      if (click.matches('#new-toy-btn')) {
        if (click.innerText === "Add a new toy!") {
          formContain.style.display = 'block'
          click.innerText = "Nevermind"
        } else if (click.innerText === "Nevermind") {
          formContain.style.display = 'none'
          click.innerText = "Add a new toy!"
        }
      }

      if (click.matches('.like-btn')) {
        let likes = click.previousElementSibling
        let newLikes = parseInt(likes.innerText.split(" ")[0]) + 1
        likes.innerText = newLikes + " Likes"

        const id = click.dataset.id

        fetch(baseUrl + id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
          },
          body: JSON.stringify({
            likes: newLikes + " Likes"
          })
        })
      }

      if (click.matches('.delete-btn')) {
        let id = click.dataset.id

        fetch(baseUrl + id, {
          method: "DELETE"
        })
        .then(resp => resp.json())
        .then(
          click.parentElement.remove()
        )
      }
    })
  }

  function submitHandler() {
    document.addEventListener("submit", function(e) {
      e.preventDefault()

      let form = document.querySelector('.add-toy-form')
      let name = form.name.value
      let image = form.image.value

      form.reset()

      fetch(baseUrl, { 
        method: "POST",
        headers: { 
          "Content-type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({
          "name": name,
          "image": image,
          "likes": 0
        })
      })
      .then(resp => resp.json())
      .then(data => {
        createToy(data)
      })
    })


  }

  getToys()
  clickHandler()
  submitHandler()
})


/*
http://localhost:3000/toys
1) send GET request and render TOYS on DOM
2) add to toy-collection div and each toy has DIV
  <div class="card">
    <h2>Woody</h2>
    <img src=toy_image_url class="toy-avatar" />
    <p>4 Likes </p>
    <button class="like-btn">Like <3</button>
  </div>
  3) when new toy is added, should show to the page by POST
  4) when like button is pressed, update likes by sending PATCH to
  `http://localhost:3000/toys/:id`
  5) when delete button is pressed, delete toy by sending DELETE
 */