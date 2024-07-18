const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const bs58 = require('bs58');

const SOL_TOKEN_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
const DOGWIFHAT_TOKEN_MINT_ADDRESS = 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm';

const SECRET_KEY = 'YOUR_PRIVATE_KEY'; 
const swapTokens = async () => {
  const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');

  const payer = web3.Keypair.fromSecretKey(bs58.decode(SECRET_KEY));

  // Load payer's SOL and Dogwifhat token accounts
  const payerSolAccount = await web3.PublicKey.findProgramAddress(
    [payer.publicKey.toBuffer()],
    splToken.TOKEN_PROGRAM_ID
  );
  const payerDogwifhatAccount = await web3.PublicKey.findProgramAddress(
    [payer.publicKey.toBuffer(), Buffer.from(DOGWIFHAT_TOKEN_MINT_ADDRESS, 'base58')],
    splToken.TOKEN_PROGRAM_ID
  );

  const amountToSwap = 1 * web3.LAMPORTS_PER_SOL; // Adjust amount as needed

  const instructions = [
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      payerSolAccount[0],
      payerDogwifhatAccount[0],
      payer.publicKey,
      [],
      amountToSwap
    )
  ];

  const transaction = new web3.Transaction().add(...instructions);

  const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log('Transaction signature:', signature);
};

swapTokens().catch(console.error);
