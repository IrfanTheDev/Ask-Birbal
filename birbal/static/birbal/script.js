document.addEventListener('DOMContentLoaded', function () {
    // Edit posts
    document.querySelectorAll('.edit').forEach(btn => {
        btn.onclick = function () {
            btn.style.display = 'none'
            // console.log(btn.dataset.postid)
            let contentDiv = document.querySelector(`#content${btn.dataset.postid}`)
            contentDiv.innerHTML =
                ` <form id="edit-post-form" class="card-text" style="margin-top: 1rem; margin-bottom: 1.6rem">
                    <div class="form-group" style="margin-bottom: .7rem">
                        <textarea 
                            style="white-space: pre-wrap; overflow: auto;" autofocus
                            oninput='this.style.height = "";this.style.height = this.scrollHeight + 3 + "px"'
                            class="form-control"
                            id="edit-post-textarea">${contentDiv.innerHTML}
                        </textarea>
                    </div>
                    <input type="submit" class="btn btn-warning post-submit" value="Save"/>
                </form>`

            document.querySelector('#edit-post-form').onsubmit = () => {
                // retrieve data entered by the user
                const content = document.querySelector('#edit-post-textarea').value;
                const post_id = btn.dataset.postid
                // console.log("Edit btn is working fine.")
                fetch('/postedit', {
                    method: 'PUT',
                    body: JSON.stringify({ content, post_id })
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.error) {
                            console.log(`Error editing post: ${result.error}`);
                        } else {
                            console.log(result.message)
                            contentDiv.innerHTML = content
                            btn.style.display = 'block'
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return false;
            }

        }
    })

    // Edit likes
    document.querySelectorAll('.like').forEach(btn => {
        btn.onclick = function () {
            console.log("like btn is clicked.")
            fetch('/postedit', {
                method: 'PUT',
                body: JSON.stringify({ toggle_like: true, post_id: btn.dataset.postid })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        console.log(`Error liking post: ${result.error}`);
                    } else {
                        console.log("changed likedsds")

                        let likes_count = document.querySelector(`#likes${btn.dataset.postid}`)

                        if (parseInt(result.likes_num) < parseInt(likes_count.innerHTML)) {
                            btn.innerHTML = "<i class='bi bi-heart'></i> Like"
                        } else if (parseInt(result.likes_num) > parseInt(likes_count.innerHTML)) {
                            btn.innerHTML = "<i class='bi bi-heart-fill' style='color: red;'></i> Liked"
                        }
                        document.querySelector(`#likes${btn.dataset.postid}`).innerHTML = result.likes_num
                    }
                })
        }
    })

    // Edit bookmarks
    document.querySelectorAll('.bookmark').forEach(btn => {
        btn.onclick = function () {
            console.log("bookmark btn is clicked.")
            fetch('/postedit', {
                method: 'PUT',
                body: JSON.stringify({ toggle_bookmark: true, post_id: btn.dataset.postid })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        console.log(`Error bookmarking post: ${result.error}`);
                    } else {
                        console.log("changed bookmarked")

                        let bmark_count = document.querySelector(`#bm${btn.dataset.postid}`)

                        if (parseInt(result.bmark_num) < parseInt(bmark_count.innerHTML)) {
                            btn.innerHTML = " <i class='bi bi-bookmark'></i> Bookmark"
                        } else if (parseInt(result.bmark_num) > parseInt(bmark_count.innerHTML)) {
                            btn.innerHTML = "<i class='bi bi-bookmark-check-fill'></i> Saved"
                        }
                        document.querySelector(`#bm${btn.dataset.postid}`).innerHTML = result.bmark_num
                    }
                })
        }
    })

    // Edit Answer posts
    document.querySelectorAll('.anseditbtn').forEach(btn => {
        btn.onclick = function () {
            btn.style.display = 'none'
            // console.log(btn.dataset.postid)
            let contentDiv = document.querySelector(`#anscontent${btn.dataset.postid}`)

            contentDiv.innerHTML = `
<div style="text-align: center;">
    <fieldset style="padding-top: 8px; height: 50px; background-color: black; border: 2px solid gold;border-radius: 5px;">
        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand('italic',false,null);"
            title="Italicize Highlighted Text" data-bs-toggle="button"><i class="bi bi-type-italic"></i></button>

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'bold',false,null);"
            title="Bold Highlighted Text" data-bs-toggle="button"><i class="bi bi-type-bold"></i></button>

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'underline',false,null);"
            title="Underline Text" data-bs-toggle="button"><i class="bi bi-type-underline"></i></button>

        <!-- Add Link Btn  -->
        <button class="btn btn-outline-warning btn-sm" onclick="AddLink()" title="Add Link on Selected Text ">
            <i class="bi bi-link-45deg"></i>
        </button>

        <select id="input-font" class="btn btn-outline-warning btn-sm" onchange="changeFont (this);"
            title="Text-Font" style="width: 100px;">
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Sans serif">Sans serif</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Palatino">Palatino</option>
            <option value="Garamond">Garamond</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Arial Black">Arial Black</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
        </select>
        <!-- font size start -->
        <select id="fontSize" onclick="changeSize()" title="Font-Size"
             class="btn btn-outline-warning btn-sm" >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
        <!-- font size end -->

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'strikethrough',false,null);"
            title="Strike Through Text" data-bs-toggle="button"><i class="bi bi-type-strikethrough"></i>
        </button>

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'justifyLeft',false,null);"
            title="Align-left" data-bs-toggle="button">
            <i class="bi bi-justify-left"></i>
        </button>

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'justifyCenter',false,null);"
            title="Justify Center" data-bs-toggle="button"><i class="bi bi-justify"></i>
        </button>

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'justifyRight',false,null);"
            title="Ailgn-right" data-bs-toggle="button">
            <i class="bi bi-justify-right"></i>
        </button>

        <button class="btn btn-outline-warning btn-sm" onclick="document.execCommand( 'undo',false,null);"
            title="Undo">
            <i class="bi bi-arrow-bar-left"></i>
        </button>

        <button class="btn btn-outline-warning btn-sm"
            onclick="document.execCommand('insertOrderedList', false, null);" title="Ordered List"
            data-bs-toggle="button"><i class="bi bi-list-ol"></i>
        </button>

        <button class="btn btn-outline-warning btn-sm"
            onclick="document.execCommand('insertUnorderedList',false, null)" title="Unordered List"
            data-bs-toggle="button"><i class="bi bi-list-ul"></i>
        </button>

        <input class="btn btn-sm" type="color" onchange="backColor()" id="nColor" title="highlight"
            style="width: 37px;height:30px">

    </fieldset>   
</div>




<script>
    function chooseColor() {
        var mycolor = document.getElementById("myColor").value;
        document.execCommand('foreColor', false, mycolor);
    }

    function changeFont() {
        var myFont = document.getElementById("input-font").value;
        document.execCommand('fontName', false, myFont);
    }

    function changeSize() {
        var mysize = document.getElementById("fontSize").value;
        document.execCommand('fontSize', false, mysize);
    }

    function checkDiv() {
        var editorText = document.getElementById("editor1").innerHTML;
        if (editorText === '') {
            document.getElementById("editor1").style.border = '5px solid red';
        }
    }

    function removeBorder() {
        document.getElementById("editor1").style.border = '1px solid transparent';
    }

    function backColor() {
        var nColor = document.getElementById("nColor").value;
        document.execCommand('backColor', false, nColor);
    }

    //Bhai is addlink function ko likhne me bahut dimaag khaarab hua. but finally i did it.
    // after too many google searches and 3 hrs on stackoverflow.
    function AddLink() {
        //identify selected text
        var selectedText = document.getSelection().toString();
        // console.log(selectedText)
        if (selectedText != "") {
            var linkURL = prompt('Enter a URL:', 'http://');
            // console.log(linkURL)
            //create link
            document.execCommand('createLink', true, linkURL);
            selectedText.anchorNode.parentElement.target = '_blank';
            // console.log("done.")
        } else {
            alert("Please select some text!");
        }
    }


</script>


<form id="edit-ans-form">

    <div id="editor2" class="form-control" contenteditable="true"
    style="white-space: normal; height: auto; padding:5px;"
    >${contentDiv.innerHTML.trim()}
    </div>

    <div style="text-align: end; margin-top: 5px;">
        <input class="btn btn-outline-success" type="submit" value="Save Answer"></>
    </div>

</form>`
            document.querySelector('#edit-ans-form').onsubmit = () => {
                // retrieve data entered by the user
                const content = document.querySelector('#editor2').innerHTML.trim();
                const post_id = btn.dataset.postid
                // console.log("Edit btn is working fine.")
                fetch('/ansedit', {
                    method: 'PUT',
                    body: JSON.stringify({ content, post_id })
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.error) {
                            console.log(`Error editing post: ${result.error}`);
                        } else {
                            console.log(result.message)
                            contentDiv.innerHTML = content
                            btn.style.display = 'block'
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return false;
            }

        }
    })



    // Edit answer usefulness.
    document.querySelectorAll('.helpful').forEach(btn => {
        btn.onclick = function () {
            console.log("helpful btn is clicked.")
            fetch('/ansedit', {
                method: 'PUT',
                body: JSON.stringify({ toggle_useful: true, post_id: btn.dataset.postid })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        console.log(`Error in toggling useful post: ${result.error}`);
                    } else {
                        console.log("changed useful")

                        let useful_count = document.querySelector(`#useful${btn.dataset.postid}`)

                        if (parseInt(result.useful_num) < parseInt(useful_count.innerHTML)) {
                            btn.innerHTML = "<i class='bi bi-award'></i>Helpful"
                        } else if (parseInt(result.useful_num) > parseInt(useful_count.innerHTML)) {
                            btn.innerHTML = "<i class='bi bi-award-fill' style='color: goldenrod;'></i>Awarded"
                        }
                        document.querySelector(`#useful${btn.dataset.postid}`).innerHTML = result.useful_num
                    }
                })
        }
    })

    
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            document.execCommand('insertLineBreak')
            event.preventDefault();
        }
      })

});