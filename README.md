## A web3 wallet listener - Blockchain event sync to database in realtime

<br>

Contract Address: "0x57Eb6aB132054787553348A0570D36a8bc260be9"

Deployment URL: https://wallet-listener.onrender.com/api/ledger

Blockchain Explorer URL: https://sepolia.etherscan.io/address/0x57eb6ab132054787553348a0570d36a8bc260be9

<br>

### Getting Started
Prerequisites,
* node.js, npm, git cli installed

<br>

**Follow the below steps for local deploymet,**

1. Clone this repository to local directory
    ```bash
    git clone https://github.com/rajeshchoudharyt/wallet-service.git
    ```

2. Redirect to root folder
    ```bash
    cd wallet-service
    ```

3. Install dependencies
    ```bash
    npm install
    ```

4. Add .env.local file with all keys (refer .env.example)

5. Run server
    ```bash
    npm start or node index.js
    ```

6. Visit http://localhost:3001 to see the output

<br>

### Architecture

The fastify backend wallet service listens to the contract events ("Deposit", "Withdrawal") in realtime by connecting to the blockchain node using Alchemy Provider.
This event listener updates the Supabase database in realtime whenever the contract emits ("Deposit", "Withdrawal") events.

<br>

**Database Schema**

**TABEL** Ledger

**COLUMNS**

wallet_address (primary key)

latest_balance (ETH)

events (array of objects)

**events column object properties** 

{

&emsp; "type": "string", (Event name - "Deposit" || "Withdrawal")
  
&emsp; "amount": "string", (ETH)
  
&emsp; "txHash":  "string", (transaction hash)
  
&emsp; "timestamp": timestamp (transaction)
  
}

**Example**
```bash
{
    "wallet_address": "0x449E773a18ccCF316bb2d72F01Bf2B2A54fA9B89",
    "latest_balance": "0.000000000000123456",
    "events": [
      {
        "type": "Deposit",
        "amount": "0.000000000000123456",
        "txHash": "0xc0e0534be324973afed9140e3c76857774f80c68c47b7b2ea1307dd4f9c6152e",
        "timestamp": "2025-04-09T16:24:36.000Z"
      },
      {
        "type": "Withdrawal",
        "amount": "0.0000000000001",
        "txHash": "0x923f91392b0670f9176bc4d5cfd8df7766dd96203c901fa07518e949c8b26038",
        "timestamp": "2025-04-09T16:23:48.000Z"
      }
    ]
}
```

<br>

## Instructions to test

1. Open chrome browser and add Metamask Extensions
2. Make sure to register on MetaMask and add Sepolia test network
3. Visit https://remix.ethereum.org to open Remix IDE
4. Create a new file "Account.sol" and copy the Smart Contract code from root/contracts/Account.sol
5. Navigate to compiler tab and compile the code
6. Navigate to Deploy tab and setup below fields,
   *  Environment: Injected Provider - MetaMask
   *  At address: Load contract address "0x57Eb6aB132054787553348A0570D36a8bc260be9"
7. Scroll below deployed contracts section and start interacting with the contract function
8. Click "getBalance" button to fetch the balance stored in contract and compare it with database for data consistency.

<br>

### To verify the contract events

1.  Visit https://wallet-listener.onrender.com/api/ledger to access the data stored in Supabase (PostgreSQL) on Chrome browser
2.  Compare the blockchain transaction with the database to verify events.
3.  URL: https://sepolia.etherscan.io/address/0x57eb6ab132054787553348a0570d36a8bc260be9
