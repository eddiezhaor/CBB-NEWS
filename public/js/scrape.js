$(document).ready(function() {
    setTimeout(() => {
        $(".masthead ").css('background-image', 'url(https://media.giphy.com/media/sq9kuVOfyr1HG/giphy.gif)');
    }, 3000);
    $("#scrape").click(function() {
        window.confirm(`Wait a few seconds to load the news!`);
        $("#content").empty();
        $("#nothing").text("Loading....")
        $.get("/api/allNews", function(data) {
            console.log(data)
            $(".masthead ").css('background-image', 'url(/image/intro-bg.jpg)');
            $("#nothing").empty();
            alert(`You have added ${data.length} news`);
            data.forEach((element, i) => {
                var titleDiv = $(`
                 <div class="row">
                     <div style="text-align:left;font-size:18px;" class="col-lg-12">
                     <u><a id="title${i}" href="${element.link}"></a></u>
                     </div>
                </div>`)
                var contentDiv = $(`   
                    <div id="NewContent${i}"class="row">
                        <div id="img${i}"class="col-lg-2"></div>
                        <div style="text-align:left;font-size:15px;" id="summary${i}" class="col-lg-4"></div>
                        <div class="col-lg-2"></div>
                        <div style="color:black; font-size:15px;"class="col-lg-4">
                            <button class="save" style="width:100px;"id=saveBtn${i} data-id="${element._id}">Save</button>
                        </div>
                    </div>`)
                $("#content").append(titleDiv).append(contentDiv)
                $(`#title${i}`).text(element.title);
                $(`#summary${i}`).text(element.summary)
                $(`#img${i}`).append(`<img class="img-responsive" width=200 height=190 src=${element.imglink}>`)
            });

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
                 <div class="row">
                     <div style="text-align:left;font-size:18px;" class="col-lg-12">
                     <u><a id="title${i}" href="${element.link}"></a></u>
                     </div>
                </div>`)
                var contentDiv = $(`   
                    <div id="NewContent${i}"class="row">
                        <div id="img${i}"class="col-lg-2"></div>
                        <div style="text-align:left;font-size:15px;" id="summary${i}" class="col-lg-4"></div>
                        <div class="col-lg-2"></div>
                        <div style="color:black; font-size:15px;"class="col-lg-4">
                            <button class="checkNotes" style="width:100px;"data-toggle="modal" data-target="#myModal" id=saveNotesBtn${i} data-id="${element._id}">See Notes</button>
                            <button class="saveNotes" style="width:100px;"data-toggle="modal" data-target="#myModal" id=saveNotesBtn${i} data-id="${element._id}">Edit Notes</button>
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
        $(".modal-footer").html(`
        <button type="button" class="submit btn btn-default" data-id=${id} data-dismiss="modal">Save</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        `)
        $.get("/api/notes/" + id, function(data) {
            if (!("notes" in data)) {
                $("textarea").val("");
            } else {
                $("textarea").val(data.notes.body)
            }

        })
    })
    $(document).on("click", ".checkNotes", function() {
        var id = $(this).attr("data-id");
        $("textarea").attr('readonly', 'readonly');
        $(".modal-footer").html(`
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        `)
        $.get("/api/notes/" + id, function(data) {
            if (!("notes" in data)) {
                $("textarea").val("");
            } else {
                $("textarea").val(data.notes.body)
            }

        })
    })
    $(document).on("click", ".submit", function() {
        var id = $(this).attr("data-id");
        $.post("/api/notes/" + id, { body: $("textarea").val().trim() }, function(data) {
            console.log(data)
        })
    })

})