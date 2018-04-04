$(document).ready(function() {
    setTimeout(() => {
        $(".masthead ").css('background-image', 'url(https://media.giphy.com/media/sq9kuVOfyr1HG/giphy.gif)');
    }, 3000);
    $("#scrape").click(function() {
        alert(`Wait a few seconds to load the news!`);
        $("#content").empty();
        $("#nothing").text("Loading....")
        $.get("/api/allNews", function(data) {
            $(".masthead ").css('background-image', 'url(/image/intro-bg.jpg)');
            $("#nothing").empty();
            alert(`You have added ${data} news`);
            location.reload();

        })
    })
    $("#savedNews").click(function() {
        alert(`Wait a few seconds to load the news!`);
        $("#content").empty();
        $("#nothing").text("Loading....")
        $.get("/api/savedNews", function(data) {
            $(".masthead ").css('background-image', 'url(/image/intro-bg.jpg)');
            $("#nothing").empty();
            alert(`You have ${data.length} saved news`);
            data.forEach((element, i) => {
                var titleDiv = $(`
                 <div class="row" id="newTitle${i}">
                     <div style="text-align:left;font-size:18px;" class="col-lg-12">
                     <u><a id="title${i}" href="${element.link}"></a></u>
                     </div>
                </div>`)
                var contentDiv = $(`   
                    <div id="NewContent${i}"class="row">
                        <div id="img${i}"class="col-lg-2"></div>
                        <div style="text-align:left;font-size:15px;" id="summary${i}" class="col-lg-4"></div>
                        <div class="col-lg-2"></div>
                        <div style="color:black; font-size:12px;"class="col-lg-4">
                            <button class="checkNotes" style="width:80px;"data-toggle="modal" data-target="#myModal" id=saveNotesBtn${i} data-id="${element._id}">See Notes</button>
                            <button class="addNotes" style="width:80px;"data-toggle="modal" data-target="#NotesModal" id=saveNotesBtn${i} data-id="${element._id}">Add Notes</button>
                            <button class="removeNotes" style="width:80px;" data-content="${i}" id=deleteNotesBtn${i} data-id="${element._id}">Remove</button>
                        </div>
                    </div>`)
                $("#content").append(titleDiv).append(contentDiv)
                $(`#title${i}`).text(element.title);
                $(`#summary${i}`).text(element.summary)
                $(`#img${i}`).append(`<img class="img-responsive" width=200 height=190 src=${element.imglink}>`)
            });
        })
    })
    $(document).on("click", ".save", function() {
        var id = $(this).attr("data-id");
        $(this).replaceWith(`<p style="color:gold; font-size:18px;">Saved <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></p>
        `)
        console.log(id)
        $.post("/api/save/" + id, function(data) {
            console.log(data)
            alert("You have saved this news!")
        })
    })
    $(document).on("click", ".saveNotes", function() {
        var id = $(this).attr("data-id");
        console.log(id)
        $("textarea").removeAttr("readonly");
        $(".myFooter").html(`
        <button type="button" class="submit btn btn-default" data-id=${id} data-dismiss="modal">Save</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        `)
        $.get("/api/myNotes/" + id, function(data) {
            console.log(data)
            $("textarea").val(data.body)

        })
    })
    $(document).on("click", ".removeNotes", function() {
        var id = $(this).attr("data-id");
        var contentId = $(this).attr("data-content")
        console.log(id)
        $.post("/api/remove/" + id, function(data) {
            $(`#newTitle${contentId}`).remove()
            $(`#NewContent${contentId}`).remove()
        })
    })
    $(document).on("click", ".checkNotes", function() {
        var id = $(this).attr("data-id");
        $.get("/api/notes/" + id, function(data) {
            if (!("notes" in data)) {
                $("textarea").val("");
            } else {
                $(".myModal-body").empty();
                data.notes.forEach((element, i) => {
                    $(".myModal-body").append(`   
                    <div  id="${element._id}" style="border:1px solid gold;">
                        <button type="button" data-id="${element._id}" class="close"">&times;</button>
                        <h4  class="saveNotes"   data-id="${element._id}" data-toggle="modal" data-target="#NotesModal" style="margin:0 0 0;color:gold";>Note${i+1}</h4>
                    </div>
                    <br>`)
                });
            }
        })
    })
    $(document).on("click", ".close", function() {
        var id = $(this).attr("data-id");
        $.post("/api/removeNotes/" + id, function(data) {
            $(`#${id}`).remove();
        })
    })
    $(document).on("click", ".submit", function() {
        var id = $(this).attr("data-id");
        $.post("/api/myNotes/" + id, { body: $("textarea").val().trim() }, function(data) {
            console.log(data)
        })
    })
    $(document).on("click", ".addNotes", function() {
        $("textarea").val("");
        var id = $(this).attr("data-id")
        $(".myFooter").html(`
        <button type="button" class="submitNotes btn btn-default" data-id=${id} data-dismiss="modal">Save</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        `)
    })
    $(document).on("click", ".submitNotes", function() {
        var id = $(this).attr("data-id")
        $.post("/api/notes/" + id, { body: $("textarea").val().trim() }, function(data) {
            console.log(data)
        })
    })
})