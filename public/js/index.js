var account, web3, usdtPrice, usdtNeed
let aviorPrice = 0.5

const provider = new WalletConnectProvider.default({
    rpc: {
        56: "https://bsc-dataseed1.ninicoin.io"
    },
});

const txtAviorAmount = document.getElementById('txt-avior-amount')

const btnConnect = document.getElementById('btn-connect')
const btnDisconnect = document.getElementById('btn-disconnect')
const btnSubmit = document.getElementById('btn-submit')

const lblUsdtNeed = document.getElementById('lbl-usdt-need')
const lblUsdtPrice = document.getElementById('lbl-usdt-price')

window.addEventListener('DOMContentLoaded', (e) => {
    getUsdtPrice()
})

const getUsdtPrice = async () => {
    web3 = new Web3(provider)
    try {
        await $.get("https://api.pancakeswap.info/api/v2/tokens/0x55d398326f99059fF775485246999027B3197955", function (data, status) {
            usdtPrice = data.data.price
        })
        lblUsdtPrice.innerText = parseFloat(aviorPrice/usdtPrice).toFixed(5)
    } catch (error) {
        alert(error.message)
    }
}

const connect = async () => {
    try {
        await provider.enable();

        var accounts = await web3.eth.getAccounts()
        account = accounts[0]
    } catch (error) {
        alert(error.message)
        location.reload()
    }

    btnConnect.classList.add('hidden')
    btnDisconnect.classList.remove('hidden')
    btnSubmit.classList.remove('hidden')
    btnSubmit.onclick = sendTransaction
}

const disconnect = async () => {
    await provider.disconnect()

    btnConnect.classList.remove('hidden')
    btnDisconnect.classList.add('hidden')
    btnSubmit.classList.add('hidden')
    btnSubmit.onclick = null
}

const sendTransaction = async () => {

}

const setUsdtNeed = async () => {
    usdtNeed = usdtPrice === 0? 0: (aviorPrice/usdtPrice) * txtAviorAmount.value
    lblUsdtNeed.innerText = usdtNeed
}

btnConnect.onclick = connect
btnDisconnect.onclick = disconnect 
btnSubmit.onclick = sendTransaction

txtAviorAmount.onkeyup = setUsdtNeed
txtAviorAmount.onchange = setUsdtNeed