window.onload = function () {
    var x = document.getElementById('mangaName');
    x.addEventListener('input', function () {
        // document.getElementById("autocomplete").innerHTML="Buy "+x.value+" Rabbits by "+ x.value+" Carrots"
        // changeContent(x.value)
        requestManga(x.value)
    });

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (x) {
        // closeAllLists(x.target);
        document.getElementById("autocomplete").innerHTML = ""
        console.log('close list')
    });
}


function requestManga(title) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `/test/${title}`);
    // xhr.setRequestHeader('Content-Type', 'json');
    // xhr.responseType = 'text/json';
    console.log("title", title)

    // const responseData = xhr.response;
    let responseData
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Handle the response from the server here
            // const responseData = xhr.responseData;
            // const responseData = JSON.parse(xhr.responseText);
            responseData = (JSON.parse(xhr.responseText))
            console.log("returned manga: ", responseData);
            changeContent(responseData)
        } else {
            console.log('Request failed. Returned status of ' + xhr.status);
        }
    }

    const data = {
        "title": title,
    }
    // xhr.send(title);
    xhr.send(title);
    // xhr.send(JSON.stringify(data))
    // 
    responseData = JSON.stringify(responseData, null, 2);
    // console.log(responseData.length)
    if (title == "") {
        changeContent('')
    }
}





function changeContent(results) {
    var field = document.getElementById("autocomplete");
    // field.innerHTML = results;
    // results = JSON.stringify(results, null, 2);
    console.log("result", results)


    let content = "";
    for (let i in results) {
        content = `${content} <div class="complete-element dropdown-button show-options" onclick="fillForm('${results[i]}')">${results[i]}</div>`;
    };
    console.log("contenty", content);
    field.innerHTML = content;
    console.log("length", results.length)
}

function fillForm(search) {
    document.getElementById("mangaName").value = search;
    // document.getElementById("autocomplete").style.display = "none"
    document.getElementById("autocomplete").innerHTML = ""
    console.log("clicked on ", search)
}

// todo
// filter manga that have chapters in desired language