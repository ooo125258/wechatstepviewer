const checkbox = document.getElementById('checkbox');
checkbox.addEventListener('click', toggleBuySell);

function toggleBuySell(e){
    if (checkbox.checked) {
        window.location.assign("./browsingViewSell");
    } else {
        window.location.assign("./browsingViewBuy");
    }
}
