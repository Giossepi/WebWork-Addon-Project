// I have no idea if this is good practice (j/w)
let answer_input = document.getElementsByClassName("codeshard")
let stylesheet = document.styleSheets[0]
let last_clicked = "init"
let new_width = 50
// add a black border to the bigger boxes so you know which ones are on and off (j/w)
stylesheet.insertRule(`.bigger { width: ${new_width}%; border: 1px solid black !important}`, 0);

function toggleBiggerClassAll(){
    total_bigger = 0
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
}

function sizeChanger(direction){
    if(direction == "up" && new_width <= 95){
        new_width += 5
    }else if(direction == "down" && new_width >= 10){
        new_width -= 5
    }
    stylesheet.deleteRule(0)
    stylesheet.insertRule(`.bigger { width: ${new_width}%;}`, 0);
    console.log(`The new width is ${new_width} percent`)
}

function toggleBiggerClassById(){
    let target = document.getElementById(last_clicked)
    target.classList.toggle("bigger")
}

function setLastClickedToId(e){
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

function spawn_preview(value){
    // ill need the position of the parent to position the live preview, whenever I get that working (j/w)
    let parent = document.getElementById(last_clicked).parentElement
    let spawned_preview = document.getElementById("output_problem_body").appendChild(document.createElement("div"))
    spawned_preview.setAttribute("id", "live-preview")
    spawned_preview.setAttribute("style", "border: 2px solid red; padding: 5px")
    spawned_preview.textContent = "`" + value + "`"
}

function validate_input(p_value){
    // backslashes need to be replaced because of JS tomfoolery (j/w)
    let v_value = p_value.replace("\\", "\\\\")
    return v_value
}

function update_preview(p_value){
    // check if a live-preview id exists (j/w)
    let child = document.getElementById("live-preview")
    // validate / format the user input (j/w)
    let v_value = validate_input(p_value)
    if(child == null){
        spawn_preview(v_value)
    }else{
        if(v_value == ""){
            child.remove()
        }else{
            // this needs to be validate way better, I want fraction bars! (j/w)
            // huh, changing from $$ encapsulating to ` (backticks) gave me my fraction bars, neato (This changed to asciimath output) (j/w)
            child.textContent = "`" + v_value + "`"
        }
    }
}
// iterate through the input boxes and attach event listeners that fire an anonymous function (j/w)
// that listens to the input event (j/w)
for(let input of answer_input){
    input.addEventListener("input", function(e){
        update_preview(input.value)
    })
}
// I should add a hotkey to insert things into the last clicked value box such as '(()()-()())/()^2' the pattern for the quotient rule (j/w)
// To begin the above I switched from the keydown event to the keyup event, this does mean you CANNOT have a box selected when using a hotkey! (j/w)
// Spun out the keydown and key up listeners, not sure if that is a good idea (j/w)
document.addEventListener("keydown", function(e){
    if(e.key == "~"){
        e.preventDefault()
        toggleBiggerClassAll()
    }else if(e.key == "|" && last_clicked != "init"){
        e.preventDefault()
        toggleBiggerClassById()
    }else if(e.key == "PageUp"){
        e.preventDefault()
        sizeChanger("up")
    }else if(e.key == "PageDown"){
        e.preventDefault()
        sizeChanger("down")
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

document.addEventListener("click", function(e){
    setLastClickedToId(e)
})

console.log("WebWork Addon Package Loaded! WAP is provided as is with no warranty or support, made by Windmann J")
console.info("WAP Hotkeys: [ ~: Toggles all input boxes changing to new size ], [ |: Toggles the last clicked input box to the new size ], [ Page Up/Page Down: Adjusts the new size of the input boxes ]")