async function submitTag() {
  //Getting the tag input to search on
  const tag = document.getElementById("tag").value;

  //Getting last weeks date
  var lastWeek = new Date();
  var pastDate = lastWeek.getDate() - 7;
  lastWeek.setDate(pastDate);
  lastWeek = Math.round(lastWeek.getTime() / 1000);

  //Doing API call to stack overflow
  const sendTime = new Date().getTime();
  const recentQuestion = `https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&fromdate=${lastWeek}&order=desc&sort=creation&tagged=${tag}&site=stackoverflow&filter=!*PBR8nclYi)J1Y.yEkh5DVscPK_BbQgKnuB)FPIQtKjQxarST`;
  let recentResponse = await fetch(recentQuestion);
  const hotQuestion = `https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&fromdate=${lastWeek}&order=desc&sort=votes&tagged=${tag}&site=stackoverflow&filter=!*PBR8nclYi)J1Y.yEkh5DVscPK_BbQgKnuB)FPIQtKjQxarST`;
  let response = await fetch(hotQuestion);
  const receiveTime = new Date().getTime();
  const responseTime = receiveTime - sendTime;

  //Getting the JSON from the responses
  let recentJSON = await recentResponse.json();
  let recentItems = recentJSON.items;

  let voteResponse = await response.json();
  let voteItems = voteResponse.items;

  //Concatinating the lists together and sorting them
  var finalObj = voteItems.concat(recentItems);
  finalObj.sort(function (a, b) {
    return b.creation_date - a.creation_date;
  });

  //Getting the table element from html
  const formdiv = document.getElementById("formdiv");
  //Looping through the response items
  for (var i = 0; i < finalObj.length; i++) {
    var buttondiv = document.createElement("div");
    //Creating the date
    var date = epochToDate(finalObj[i].creation_date);

    //Set the innterHTML for the element being appended on
    buttondiv.innerHTML +=
      `<button type="button" onclick="collapse(${i})" class="btn btn-outline-secondary btn-lg col-12 collapsible">${
        finalObj[i].title
      } || ${date} || Score: ${finalObj[i].score} </button>
    <div id="${i}" style="display: none" class="content">
    <h2>Question</h2>
    <div class="card">
      <div class="card-body">
        ${finalObj[i].body}
      </div>
      <h3>Comments</h3>
      ${appendComments(finalObj[i])}
    </div>
      <h2 id="answers${i}">Answers</h2>` +
      appendAnswers(finalObj[i]) +
      `
    </div>
    <br></br>`;
    //Appending the div onto the div container
    formdiv.appendChild(buttondiv);
  }
  var responseDiv = document.createElement("div");
  responseDiv.innerHTML += `<p>The response time is ${responseTime} ms'. </p>`;
  formdiv.appendChild(responseDiv);
}

function appendComments(items) {
  var comments = `<p>No comments found</p>`;
  if (items.comments != null) {
    comments = ``;
    for (var j = 0; j < items.comments.length; j++) {
      comments += `<div class="list-group">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Score: ${items.comments[j].score}</h5>
        <small>${epochToDate(items.comments[j].creation_date)}</small>
        </div>
        <p>${items.comments[j].body}</p>
      </div>`;
    }
  }
  return comments;
}

function appendAnswers(items) {
  var answers = `<p>None found<p>`;
  if (items.answers != null) {
    answers = ``;
    for (var j = 0; j < items.answers.length; j++) {
      answers += `<div class="card">
        <div class="card-header">
          <b>Answer ${j}</b> Score: ${
        items.answers[j].score
      } Created: ${epochToDate(items.answers[j].creation_date)}
        </div>
        <div class="card-body">
          ${items.answers[j].body}
        </div>
        <h3>Comments</h3>
        ${appendComments(items.answers[j])}
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

function epochToDate(epochSeconds) {
  const date = new Date(0);
  date.setUTCSeconds(epochSeconds);
  return date;
}
