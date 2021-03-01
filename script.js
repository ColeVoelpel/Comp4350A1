async function submitTag() {
  //Getting the tag input to search on
  const tag = document.getElementById("tag").value;
  //Doing API call to stack overflow
  const questions = `https://api.stackexchange.com/2.2/questions?fromdate=1613779200&todate=1614384000&order=desc&sort=creation&tagged=${tag}&site=stackoverflow&filter=!m)ASvzmwfr403f*F5dU1)8hbeB3Kgkc8rhKafuMzR-Es.)4fbDi5D6gX`;
  let response = await fetch(questions);
  let jsonResponse = await response.json();
  console.log(jsonResponse);
  //Getting the table element from html
  const formdiv = document.getElementById("formdiv");
  //Looping through the response items
  for (var i = 0; i < jsonResponse.items.length; i++) {
    var buttondiv = document.createElement("div");
    //Set the innterHTML for the element being appended on
    buttondiv.innerHTML +=
      `<button type="button" onclick="collapse(${i})" class="btn btn-outline-secondary btn-lg col-12 collapsible">${
        jsonResponse.items[i].title
      } || ${new Date(jsonResponse.items[i].creation_date)} || ${
        jsonResponse.items[i].score
      } </button>
    <div id="${i}" style="display: none" class="content">
    <h2>Question</h2>
    <div class="card">
      <div class="card-body">
        ${jsonResponse.items[i].body}
      </div>
    </div>
      <h2 id="answers${i}">Answers</h2>` +
      appendAnswers(jsonResponse.items[i], i) +
      `
    </div>
    <br></br>`;
    //Appending the div onto the div container
    formdiv.appendChild(buttondiv);
  }
}

function appendAnswers(items, i) {
  var answers = `<p>None found<p>`;
  if (items.answers != null) {
    answers = ``;
    for (var j = 0; j < items.answers.length; j++) {
      answers += `<div class="card">
        <div class="card-header">
          Answer ${j}
        </div>
        <div class="card-body">
          ${items.answers[j].body}
        </div>
      </div>
    `;
    }
  }
  return answers;
}

function collapse(id) {
  var content = document.getElementById(id);
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}
