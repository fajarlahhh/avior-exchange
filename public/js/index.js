var account, web3, usdtNeed

const provider = new WalletConnectProvider.default({
    rpc: {
        56: "https://bsc-dataseed1.ninicoin.io"
    },
});

const btnConnect = document.getElementById('btn-connect')
const btnDisconnect = document.getElementById('btn-disconnect')
const lblAviorUsdtPrice = document.getElementById('lbl-avior-usdt-price')

window.addEventListener('DOMContentLoaded', (e) => {
    $("#section-waiting").hide()
    $("#section-form").hide()
    web3 = new Web3(provider)
    connect()
    
    lblAviorUsdtPrice.innerText = parseFloat(aviorPrice/usdtPrice).toFixed(5) + " USDT"
})

const connect = async () => {
    $("#section-form").show()
    try {
        lblAviorUsdtPrice.innerText = parseFloat(aviorPrice/usdtPrice).toFixed(5) + " USDT"

        await provider.enable()
        .then(() => console.log("Provider enabled"))
        .catch(() => location.reload());

        var accounts = await web3.eth.getAccounts()
        account = accounts[0]

        $.post("/login",{  account:account },function(data){
            $("#section-connect").hide()
            btnDisconnect.classList.remove('hidden')
            $("#form").load("/" + data);
        });
    } catch (error) {
        alert(error.message)
        location.reload()
    }
}

btnConnect.onclick = connect

btnDisconnect.onclick = async () => {
    await $.post("/logout", [],function(data){
        if (data === 'success') {
            provider.disconnect()
            .then(() => {
                btnDisconnect.classList.add('hidden')
                $("#section-connect").show()
                $("#section-form").hide()
            })
            .catch(() => location.reload());
        }
    })
} 