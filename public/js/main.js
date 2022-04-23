
function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

        // if any scroll is attempted, set this to the previous value
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };
}

function enableScroll() {
    window.onscroll = function () { };
}

var listGroup = Array.from(document.querySelectorAll('ul li div.MuiListSubheader-root'))

listGroup.forEach((item, index) => {
    item.addEventListener('click', () => {
        var selector = document.querySelectorAll('.MuiAutocomplete-listbox .MuiAutocomplete-groupUl')[index].querySelectorAll('li')[1];
        if (selector) selector.scrollIntoView({ behavior: "smooth" })
    })
})

