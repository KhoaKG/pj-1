// Button status
const buttonsStatus = document.querySelectorAll("[button-status]")
if(buttonsStatus.length > 0){
    let url = new URL(window.location.href)
    buttonsStatus.forEach(button =>{
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status")
            if(status){
                url.searchParams.set("status", status)
            }else{
                url.searchParams.delete("status")
            }
            window.location.href = url
        })
    })
}

// End Button Status

// Search
const formSearch = document.querySelector("#form-search")

if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e)=>{
        e.preventDefault()
        const keyword = e.target[0].value
        if(keyword){
            url.searchParams.set("keyword", keyword)
        }else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url
    })
}

// End Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")

if(buttonsPagination.length > 0){
    let url = new URL(window.location.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click", ()=>{
            const page = button.getAttribute("button-pagination")
            if(page){
                url.searchParams.set("page", page)
            }else{
                url.searchParams.delete("page")
            }
            window.location.href = url
        })
    })
}

// End Pagination

// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
console.log(buttonsChangeStatus);

if(buttonsChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")
    buttonsChangeStatus.forEach(button=>{
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("data-status")
            let statusChange = status == "active" ? "inactive" : "active"
            const id = button.getAttribute("data-id")

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            formChangeStatus.action = action
            formChangeStatus.submit()

        })
    })
}

// End Change Status

// Change Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputIds = document.querySelectorAll("input[name='id']")
    
    inputCheckAll.addEventListener("click", ()=>{
        if(inputCheckAll.checked){
            inputIds.forEach(input =>{
                input.checked = true
            })
        }else{
            inputIds.forEach(input =>{
                input.checked = false
            })
        }
    })

    inputIds.forEach(input =>{
        input.addEventListener("click", ()=>{
            const inputChecked = document.querySelectorAll("input[name='id']:checked").length
            if(inputChecked == inputIds.length){
                inputCheckAll.checked = true
            }else{
                inputCheckAll.checked = false
            }
        })
    })  
}

const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e)=>{
        e.preventDefault()
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
        const typeChange = e.target.elements.type.value
        if(typeChange == "delete-all"){
            const isConfirm = confirm("BẠN CÓ CHẮC CHẮN MUỐN XOÁ?")
            if(!isConfirm){
                return
            }
        }
        
        if(inputChecked.length > 0){
            let ids = []
            inputChecked.forEach(input =>{
                const id = input.value
                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids.push(`${id}-${position}`)
                }else{
                    ids.push(id)
                }
            })
            ids = ids.join(" ")
            
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            inputIds.value = ids
    
            formChangeMulti.submit()
        }
        
    })
}

// End Change Multi

// Button Delete

const buttonsDelete = document.querySelectorAll("[button-delete]")

if(buttonsDelete.length > 0){
    const formDelete = document.querySelector("#form-delete")
    const path = formDelete.getAttribute("data-path")
    buttonsDelete.forEach(button =>{
        button.addEventListener("click", ()=>{
            const id = button.getAttribute("data-id")
            const action = path + `/${id}?_method=DELETE`

            formDelete.action = action

            formDelete.submit()
        })
    })
}

// End Button Delete


// Alert
const showAlert = document.querySelector("[show-alert]")
    if(showAlert){
        const time = parseInt(showAlert.getAttribute("data-time"))
        const closeAlert = showAlert.querySelector("[close-alert]")
        setTimeout(() => {
            showAlert.classList.add("alert-hidden")
        }, time);
        closeAlert.addEventListener("click",()=>{
            showAlert.classList.add("alert-hidden")
        })
    }

// End Alert

// upload image

const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
        const uploadImagePreview = document.querySelector("[upload-image-preview]")
        uploadImageInput.addEventListener("change", (e)=>{
            const file = e.target.files[0]
            if(file){
                uploadImagePreview.src = URL.createObjectURL(file)
            }
        })
}

// emd image

// SORT

const sort = document.querySelector("[sort]")

if(sort){
    let url = new URL(window.location.href)
    const sortSelect = document.querySelector("[sort-select]")
    const sortClear = document.querySelector("[sort-clear]")
    sortSelect.addEventListener("change", (e)=>{
        const value = e.target.value
        const [sortKey, sortValue] = value.split("-")
        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortValue", sortValue)
        
        window.location.href = url
    })
    sortClear.addEventListener("click", ()=>{
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")
        window.location.href = url
    })
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")
    if(sortValue && sortKey){
        const stringSort = `${sortKey}-${sortValue}`
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected = true
    }
}

// END SORT