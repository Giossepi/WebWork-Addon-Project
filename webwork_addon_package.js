// I have no idea if this is good practice (j/w)
let answer_input = document.getElementsByClassName("codeshard")
let preview_button = document.getElementById("previewAnswers_id")
let answer_button = document.getElementById("submitAnswers_id")
let stylesheet = document.styleSheets[0]
let last_clicked = "init"
let new_width = 30
let preview_hidden = false
let preview_disabled = false
let last_value = "init"
stylesheet.insertRule(`.bigger {width: ${new_width}rem; border: 1px solid black !important; z-index: 100000}`, 0);
stylesheet.insertRule(`#live-preview {
    position: absolute;
    border: 2px solid red; 
    border-radius: .5rem;
    user-select: none;
    background-color: ghostwhite;
    padding: 5px;
    }`, 1)
stylesheet.insertRule(`.obscured {filter: blur(1px) !important;}`, 2)
// this is effectively a placeholder, we need to know where our hover_position rule will be to delete it
// so we create this and insert at index 3 so we can delete it later and give it the real offsets (j/w)
stylesheet.insertRule(`.hover_position {translate: 0px 0px;}`, 3)
stylesheet.insertRule(`#live-preview:hover {cursor: pointer}`, 4)
stylesheet.insertRule(`#wap-settings-button {
    position: absolute;
    border: 2px solid lightgreen; 
    border-radius: .5rem;
    user-select: none;
    background-color: ghostwhite;
    padding: 5px;
    }`, 5)
stylesheet.insertRule(`.pict_position {translate: 0px 0px;}`, 6)
stylesheet.insertRule(`#wap-settings-button:hover {cursor: pointer}`, 7)

function toggle_bigger_class_all(){
    let child = document.getElementById("live-preview")
    let total_bigger = 0
    for(let div of answer_input){
        if(div.className.includes("bigger")){
            total_bigger++
        }
    }
    if(total_bigger == 0){
        for(let div of answer_input){
            div.classList.add("bigger")
        }
    }else{
        for(let div of answer_input){
            div.classList.remove("bigger")
        }
    }
    if(child != null){
        update_preview_position()
    }
}
// The following two functions are designed to allow someone to retrieve an answer if it was typed in but WW logged them out before submission (j/w)
function update_saved_value(in_value){
    this.last_value = in_value
}

function save_value(){
    if(this.last_value != "init"){
        localStorage.setItem("last_value", this.last_value)
    }
}

function retrieve_last_value(){
    console.log(localStorage.getItem("last_value"))
}

function size_changer(direction){
    if(direction == "up"){
        new_width += 3
    }else if(direction == "down" && new_width >= 6){
        new_width -= 3
    }
    stylesheet.deleteRule(0)
    stylesheet.insertRule(`.bigger {width: ${new_width}rem; border: 1px solid black !important; z-index: 100000}`, 0);
    console.log(`The new width is ${new_width} rem`)
}

function toggle_bigger_class_by_id(){
    let child = document.getElementById("live-preview")
    let target = document.getElementById(last_clicked)
    target.classList.toggle("bigger")
    if(child != null){
        update_preview_position()
    }
}

function set_last_clicked_to_id(e){
    let target_classes = e.target.className
    if(target_classes.includes("codeshard")){
        if(e.target.id != ""){
            last_clicked = e.target.id
        }
    }
}

function set_last_clicked_to_value(p_value){
    let target = document.getElementById(last_clicked)
    target.value = p_value
}

function update_preview_position(){
    // all pages with a problem have a problem_body so we can use that as our attach target (j/w)
    let parent = document.getElementById("problem_body").parentElement
    // get the offset of that target relative to the viewport (browser window) (j/w)
    let parent_x = parent.getBoundingClientRect().x
    let parent_y = parent.getBoundingClientRect().y
    // we also need the relative position of the input box the user has targeted (j/w)
    let input_x = document.getElementById(last_clicked).getBoundingClientRect().x
    let input_y = document.getElementById(last_clicked).getBoundingClientRect().y
    // finally offset where we spawn our live-preview by the width of the user targeted input plus 50 px for breathing room (j/w)
    let input_length = document.getElementById(last_clicked).getBoundingClientRect().width + 50
    // compute the offset and save as vars for inserting into our css rule (j/w)
    let offset_x = (input_x - parent_x) + input_length
    let offset_y = input_y - parent_y
    // create the new rule (j/w)
    let hover_style = `.hover_position {translate: ` + offset_x + `px ` + offset_y + `px;}`
    // delete the rule and respawn it to ensure the new values are transferred (j/w)
    stylesheet.deleteRule(3)
    stylesheet.insertRule(hover_style, 3)
}

function spawn_settings_pict(){
    let parent = document.getElementById("content")
    let parent_x = parent.getBoundingClientRect().width
    
    let pict_to_spawn = document.createElement("div")
    pict_to_spawn.setAttribute("id", "wap-settings-button")
    pict_to_spawn.textContent = "Settings"
    pict_to_spawn.addEventListener("click", function(e) {
        enable_preview();
    })
    parent.prepend(pict_to_spawn)
    let offset = parent_x - pict_to_spawn.getBoundingClientRect().width
    let pict_pos = `.pict-position {translate: ` + offset + `px 0px;}`
    stylesheet.deleteRule(6)
    stylesheet.insertRule(pict_pos, 6)
    pict_to_spawn.classList.add("pict-position")
}

function despawn_settings_pict(){
    let target = document.getElementById("wap-settings-button")
    if(target != null){
        target.remove()
    }
}

function spawn_preview(value){
    let parent = document.getElementById("problem_body").parentElement
    update_preview_position()
    let preview_to_spawn = document.createElement("div")
    preview_to_spawn.setAttribute("id", "live-preview")
    preview_to_spawn.textContent = "`" + value + "`"
    preview_to_spawn.classList.add("hover_position")
    preview_to_spawn.addEventListener("click", function(e) {
        disable_preview();
    })
    parent.appendChild(preview_to_spawn)
}

function validate_input(p_value){
    // backslashes need to be replaced because of JS tomfoolery (j/w)
    let v_value = p_value.replace("\\", "\\\\")
    return v_value
}

function update_preview(p_value){
    // check if a live-preview id exists (j/w)
    let child = document.getElementById("live-preview")
    if(this.preview_disabled != true){
        // validate / format the user input (j/w)
        let v_value = validate_input(p_value)
        if(child == null){
            spawn_preview(v_value)
        }else{
            if(v_value == ""){
                child.remove()
            }else{
                update_preview_position()
                // this needs to be validate way better, I want fraction bars! (j/w)
                // huh, changing from $$ encapsulating to ` (backticks) gave me my fraction bars, neato (This changed to asciimath output) (j/w)
                child.textContent = "`" + v_value + "`"
            }
        }
        update_saved_value(v_value)
        save_value()
    }
}

function hide_preview(){
    // hide and show preview can probably be one toggle function instead of two discreet functions (j/w)
    let child = document.getElementById("live-preview")
    if(child != null){
        if(!preview_hidden){
            child.classList.add("obscured")
            preview_hidden = true
        }
    }
}

function show_preview(){
    // hide and show preview can probably be one toggle function instead of two discreet functions (j/w)
    let child = document.getElementById("live-preview")
    if(child != null){
        if(preview_hidden){
            child.classList.remove("obscured")
            preview_hidden = false
        }
    }
}

// TODO: This needs to also stop new previews from being spawned, hmmmm

function enable_preview(){
    this.preview_disabled = false
    despawn_settings_pict()
}

function disable_preview(){
    let child = document.getElementById("live-preview")
    if(child != null){
        child.remove()
    }
    this.preview_disabled = true
    spawn_settings_pict()
}

function debounce(callback) {
    let timer
    return function() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback();
        }, 250)
    }
}


let timed_show = debounce(show_preview)
// iterate through the input boxes and attach event listeners that fire an anonymous function (j/w)
// that listens to the input event (j/w)
for(let input of answer_input){
    input.addEventListener("input", function(e){
        update_preview(input.value)
        hide_preview()
        timed_show()
    })
    input.addEventListener("focus", function(e){
        set_last_clicked_to_id(e)
    })
    //TODO: This is making all of the input boxes be the first things tab applies to, need to make the preview and then submit buttons after (j/w)
    input.setAttribute("tabindex", "1")
}
//TODO: This should make the preview button, then the answer button be the things you tab to after input boxes (j/w)
// additionally now that these buttons have been picked out saving attempted answers is much easier
preview_button.setAttribute("tabindex", "2")
answer_button.setAttribute("tabindex", "3")
// I should add a hotkey to insert things into the last clicked value box such as '(()()-()())/()^2' the pattern for the quotient rule (j/w)
// To begin the above I switched from the keydown event to the keyup event, this does mean you CANNOT have a box selected when using a hotkey! (j/w)
// Spun out the keydown and key up listeners, not sure if that is a good idea (j/w)
document.addEventListener("keydown", function(e){
    if(e.key == "~"){
        e.preventDefault()
        toggle_bigger_class_all()
    }else if(e.key == "|" && last_clicked != "init"){
        e.preventDefault()
        toggle_bigger_class_by_id()
    }else if(e.key == "PageUp"){
        e.preventDefault()
        size_changer("up")
    }else if(e.key == "PageDown"){
        e.preventDefault()
        size_changer("down")
    }else if(e.key == "End"){
        e.preventDefault()
        disable_preview()
    }else if(e.key == "Home"){
        e.preventDefault()
        enable_preview()
    }
})
// you cannot capture print screen on keydown (j/w)
document.addEventListener("keyup", function(e){
    if(e.key == "PrintScreen"){
        // TODO: THIS SHOULD OPEN A MENU WITH A FEW COMMON ONES, NOT JUST HARD CODED ONE (j/w)
        e.preventDefault()
        set_last_clicked_to_value("(()()-()())/()^2")
    }
})

console.log("WebWork Addon Package Loaded! WAP is provided as is with no warranty or support, made by Windmann J")
console.info("WAP Hotkeys: [ ~: Toggles all input boxes changing to new size ], [ |: Toggles the last clicked input box to the new size ], [ Page Up/Page Down: Adjusts the new size of the input boxes ], [ PrtScn: Pastes '(()()-()())/()^2' into the last clicked input box ]")

console.log("\nLast value was:")
retrieve_last_value()