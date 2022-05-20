function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
function get_round(i) {
    http = new XMLHttpRequest()
    http.open('GET', 'https://api.csgowin.gg/crash/get-game/' + i, false)
    http.send()
    x = JSON.parse(http.responseText)
    while (http.status!=200) {
        sleep(1000)
        http.open('GET', 'https://api.csgowin.gg/crash/get-game/' + i, false)
        http.send()
        x = JSON.parse(http.responseText)
        
    }
    return x["data"]["game"]["crashed_at"]
}
item = 2056

function setheaders(http) {
    http.setRequestHeader('auth-token', 'o9UwGWWjJOOybBSsWsP2u64wKfuIuAsr')
    http.setRequestHeader('accept', 'application/json, text/plain, */*')
    http.setRequestHeader('content-type', 'application/x-www-form-urlencoded')

}

function buy_items(buy_items, sell_items) {
    http = new XMLHttpRequest()
    http.open('POST', 'https://api.csgowin.gg/shop/buy-items', false)
    setheaders(http)
    var params = 'shop_items=' + encodeURIComponent(JSON.stringify(buy_items)) + '&inventory_items=' + encodeURIComponent(JSON.stringify(sell_items));
    http.send(params)
}
function place_bet(game_id, items) {
    http = new XMLHttpRequest()
    http.open('POST', 'https://api.csgowin.gg/crash/place-bet', false)
    setheaders(http)
    var params = 'game_id=' + encodeURI(game_id) + '&items=' + encodeURI(JSON.stringify(items)) + '&cashout_ratio=1.2' + '&ping=96&xy=0%2C0'
    http.send(params)
    console.log(http.responseText)
}
function get_inv() {
    http = new XMLHttpRequest()
    http.open('GET', 'https://api.csgowin.gg/inventory/get-tradable?page=1', false)
    setheaders(http)
    http.send()
    return JSON.parse(http.responseText)['data']['items']
}
function main(i) {
    lis = []
    while ((lis.length) < 4) {
        lis.push(get_round(i))
        i = i + 1
        sleep(1500)
    }
    while (true) {
        sleep(1000)
        lis.push(get_round(i))
        i = i + 1
        console.log(lis[lis.length-1])

        inv = get_inv()
        if (lis[lis.length - 1] < 1.2 && lis[lis.length - 2] < 1.2) {
            x = 0
            sleep(1500)
            while (x < 7) {
                place_bet(i, [inv[0]['id']])
                x = x + 1
                sleep(1200)
            }
        }
        x = []
        inv = get_inv()
        l = 0
        while (l < inv.length) {
            if (inv[l]['item'] != item) {
                x.push(inv[l]['id'])
            }
            l = l + 1
        }
        buy_items([item], x)

    }
}
