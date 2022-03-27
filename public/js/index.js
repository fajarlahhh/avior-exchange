var account, web3, usdtPrice, usdtNeed, aviorNeed
let aviorPrice = 0.5

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
    await provider.enable();

    await web3.eth.getAccounts(function(err, accounts){
        if (err != null) 
            alert("An error occurred: "+err)
        else if (accounts.length == 0) 
            console.log("User is not logged in to MetaMask");
        else 
            connect()
    });

    getUsdtPrice()
})

const getUsdtPrice = async () => {
    try {
        await $.get("https://api.pancakeswap.info/api/v2/tokens/0x55d398326f99059fF775485246999027B3197955", function (data, status) {
            usdtPrice = data.data.price
        })
        lblAviorUsdtPrice.innerText = parseFloat(aviorPrice/usdtPrice).toFixed(5) + " USDT"
    } catch (error) {
        alert(error.message)
    }
}

const sendTransaction = async () => {
    try {
        $('#section-form').hide()
        $('#section-waiting').show() 

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
        var unique = null;
        await $.post("/create", {
            account : account,
            usdt : usdtNeed,
            avior : aviorNeed
        }, function(data, status){
            if (status == 'success') {
                unique = data
            }else{
                alert('Transaction Failed')
    
                window.onbeforeunload = null
                view.classList.remove('hidden')
                return
            }
        });
        
        await contract.methods.transfer('0x98cfb452e87a506C96Fd06D46d3143eAe15110D0', web3.utils.toWei(usdtNeed.toString(), 'ether')).send({
            from: fromAddress, gas: 100000},function (error, result){ 
            if(!error){
                $.post("/update", {
                    unique : unique,
                    txid : result
                }, function(data, status){
                    if (!status == 'success') {
                        alert('Transaction Failed')
                    }else{
                        alert('Your transaction was successful. Your avior will be sent to your wallet within 1x24 hours')
                    }
                });
            }
        });
    } catch (error) {
        alert(error.message)
    }
    window.onbeforeunload = null
    location.reload()
}

const connect = async () => {
    $("#section-form").show()
    try {
        var accounts = await web3.eth.getAccounts()
        account = accounts[0]

        await $.post("/delete", {
            account : account,
        }, function(data, status){
            if (status != 'success') {
                location.reload()
                return
            }
        });

        if (account == '0x98cfb452e87a506C96Fd06D46d3143eAe15110D0') {
            $("#form").load("/admin");
        } else {
            $("#form").load("/form");
        }
    } catch (error) {
        alert(error.message)
        location.reload()
    }

    btnConnect.classList.add('hidden')
    btnDisconnect.classList.remove('hidden')
    getUsdtPrice()
}

btnConnect.onclick = connect

btnDisconnect.onclick = async () => {
    await provider.disconnect()

    btnConnect.classList.remove('hidden')
    btnDisconnect.classList.add('hidden')
    btnSubmit.classList.add('hidden')
    btnSubmit.onclick = null
} 