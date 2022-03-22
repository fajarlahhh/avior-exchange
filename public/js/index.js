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
const lblAviorUsdtPrice = document.getElementById('lbl-avior-usdt-price')

const formSend = document.getElementById('form-send')

window.addEventListener('DOMContentLoaded', (e) => {
    getUsdtPrice()
})

const getUsdtPrice = async () => {
    web3 = new Web3(provider)
    try {
        await $.get("https://api.pancakeswap.info/api/v2/tokens/0x55d398326f99059fF775485246999027B3197955", function (data, status) {
            usdtPrice = data.data.price
        })
        lblAviorUsdtPrice.innerText = parseFloat(aviorPrice/usdtPrice).toFixed(5)
    } catch (error) {
        alert(error.message)
    }
}

const sendTransaction = async () => {
    try {
        await btnSubmit.classList.add('hidden')
        await txtAviorAmount.classList.add('hidden')
        var contractAbi = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getOwner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
        var tokenAddress = '0x55d398326f99059fF775485246999027B3197955'
        var fromAddress = account
        window.onbeforeunload = function() {
            return "Dude, are you sure you want to leave? Think of the kittens!";
        }
        var contract = new web3.eth.Contract(contractAbi, tokenAddress)
        await contract.methods.transfer('0xa81bc9d277c5b8e34bd61738bb4326dcbfc38528', web3.utils.toWei(usdtNeed.toString(), 'ether')).send({
            from: fromAddress, gas: 100000},function (error, result){ 
            if(!error){
                console.log(result)
                $.post("/send", {
                    account : account,
                    usdt : usdtNeed,
                    avior : txtAviorAmount.value,
                    txid : result
                }, function(data, status){
                    alert("Data: " + data + "\nStatus: " + status);
                });
            } 
        });
    } catch (error) {
        alert(error.message)
    }
    window.onbeforeunload = null
    btnSubmit.classList.remove('hidden')
    txtAviorAmount.classList.remove('hidden')
}

const setUsdtNeed = () => {
    usdtNeed = usdtPrice === 0? 0: (aviorPrice/usdtPrice) * txtAviorAmount.value
    lblUsdtNeed.innerText = usdtNeed
}

btnConnect.onclick = async () => {
    try {
        await provider.enable();

        var accounts = await web3.eth.getAccounts()
        account = accounts[0]
        formSend.classList.remove('hidden')
    } catch (error) {
        alert(error.message)
        location.reload()
    }

    btnConnect.classList.add('hidden')
    btnDisconnect.classList.remove('hidden')
    btnSubmit.classList.remove('hidden')
    btnSubmit.onclick = sendTransaction
}

btnDisconnect.onclick = async () => {
    await provider.disconnect()

    btnConnect.classList.remove('hidden')
    btnDisconnect.classList.add('hidden')
    btnSubmit.classList.add('hidden')
    btnSubmit.onclick = null
    formSend.classList.remove('hidden')
} 

btnSubmit.onclick = sendTransaction

txtAviorAmount.onkeyup = setUsdtNeed
txtAviorAmount.onchange = setUsdtNeed