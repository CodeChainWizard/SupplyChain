require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.17", // Specify your Solidity version
  networks: {
    hardhat: {
      chainId: 31337, // Default Hardhat chain ID
    },
  },
};

// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.28",
//   networks: {
//     mumbai: {
//       url: `https://polygon-amoy.g.alchemy.com/v2/NO4ztLfeI0yv226QY4_hL7kSYgglHRn8`,
//       accounts: [
//         `28168a1803daf07d176a4c1c34bb754056b26f47ba6f1ef075f2e2f623578439`,
//       ],
//       chainId: 80002,
//     },
//   },
// };
