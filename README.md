<a href="https://www.buymeacoffee.com/maxwellfortney" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>


# next-candy-machine

**I recommend using Linux to make this process as easy as possible.**

### Prerequisites

- Ensure you have recent versions of both `node` and `yarn` installed.

- Follow the instructions [here](https://docs.solana.com/cli/install-solana-cli-tools) to install the Solana Command Line Toolkit.

- Follow the instructions [here](https://hackmd.io/@levicook/HJcDneEWF) to install the Metaplex Command Line Utility.
  - Installing the Command Line Package is currently an advanced task that will be simplified eventually.

### Installation

1. Clone the project

```
git clone https://github.com/Smart970108/sol_coin_flip
```

2. Install yarn dependencies

```
yarn install
```

3. rename the `.env.template` file at the root directory to `.env.local`.

#### This will output our 1st required environment variable into the terminal as `pubkey`, and will be our treasury SOL address. Set `NEXT_PUBLIC_TREASURY_ADDRESS` in our `.env.local` to this address.

## Deploying to Vercel
1. Connect your Github account to Vercel
2. Create a new project from your repo
3. Before clicking `Deploy`, add all of your environment variables
4. Click `Deploy`
