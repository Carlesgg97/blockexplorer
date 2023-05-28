import {Alchemy, Network} from 'alchemy-sdk';
import {useEffect, useState} from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
    const [blockNumber, setBlockNumber] = useState();
    const [block, setBlock] = useState();
    const [txReceipts, setTxReceipts] = useState({});

    useEffect(() => {
        async function getAndSetBlockNumber() {
            setBlockNumber(await alchemy.core.getBlockNumber());
        }

        getAndSetBlockNumber();
    }, []);

    useEffect(() => {
        if (blockNumber === undefined) return;

        async function getAndSetBlock() {
            setBlock(await alchemy.core.getBlock(blockNumber));
        }

        getAndSetBlock();
    }, [blockNumber]);

    function getTxReceipt(e, tx) {
        e.preventDefault();
        if (txReceipts.hasOwnProperty(tx)) return;

        async function getAndSetTxReceipt(tx) {
            const receipt = await alchemy.core.getTransactionReceipt(tx);
            setTxReceipts({...txReceipts, [tx]: receipt});
        }
        getAndSetTxReceipt(tx);
    }

    return <div className="App">
        <p>Block Number: {blockNumber}</p>
        <p>Block Hash: {block?.hash}</p>
        <br/>
        <h6>Transactions</h6>
        {block?.transactions.map((tx) => <div key={tx+'div'}>
            <p onClick={(e) => getTxReceipt(e, tx)} key={tx}>{tx}</p>
            {txReceipts[tx] && <div key={tx+'div_'}>
                <p key={tx+'from'}>From: {txReceipts[tx].to}</p>
                <p key={tx+'to'}>To: {txReceipts[tx].from}</p>
            </div>}
        </div>)}
    </div>
}

export default App;
