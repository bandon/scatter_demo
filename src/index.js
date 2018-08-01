import Eos from 'eosjs'
import BigNumber from 'bignumber.js';

const toBigNumber = asset => {
  if (BigNumber.isBigNumber(asset)) {
    return asset;
  } else if (isNaN(asset)) {
    if (!asset) return new BigNumber('0');
    const match = asset.match(/^([0-9.]+) EOS$/);
    const amount = match ? match[1] : '0';
    return new BigNumber(amount);
  } else {
    return new BigNumber(asset);
  }
};

const toAsset = (_amount, symbol = 'EOS', { precision = '4' } = {}) => {
  const amount = toBigNumber(_amount).toFixed(Number(precision));
  return [amount, symbol].join(' ');
};

let is_running = false;
let submit = document.getElementById('submit');

var check_scatter_transfer = (to) => {
    const scatter = window.scatter;
    let network = {
        protocol:'https',
        blockchain: 'eos',
        host:"w1.eosforce.cn",
        port:443,
        chainId: 'bd61ae3a031e8ef2f97ee3b0e62776d6d30d4833c8f7c1645c657b149151004b',
    }
    scatter
    .getIdentity({accounts:[network]})
    .then(identity => {
        console.log(identity);
        const account = identity.accounts.find(function(acc){
             console.log(acc);
             return acc.blockchain === 'eos';
        });
        console.log("identity info",identity);
        console.log(JSON.stringify(identity));
        let options = {
         authorization: account.name+'@'+account.authority,
         broadcast: true,
         sign: true
        }    
        //get EOS instance ,
        let eos = scatter.eos(network, Eos,  options, "https");
        let from = account.name, 
            amount = 0.3, 
            memo = '你好', 
            tokenSymbol = 'EOS', 
            precision = '4';

        eos
        .contract(tokenSymbol === 'EOS' ? 'eosio' : 'eosio.token')
        .then(token => {
          console.log('token', token);
          token.transfer(account.name, to, toAsset(amount, tokenSymbol, { precision }), memo)
          .then(res => {
            if(res.transaction_id) alert('transfer success');
            submit.innerText = '转账';
            is_running = false;
          })
        });

    });  
}


submit.addEventListener('click', function(){
  if(is_running) return ;
  is_running = true;
  submit.innerText = '转账中...';
  var val = document.getElementById('transfer').value;
  if(!val){
    alert('请填写转账对象');
    return ;
  }
  check_scatter_transfer(val)
})
document.addEventListener('scatterLoaded', scatterExtension => {
    console.log("scatterLoaded called!");
    // check_scatter_transfer();
});