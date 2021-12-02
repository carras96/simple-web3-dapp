import BigNumber from "bignumber.js"

export const convertWeiToEther = (number: number) => {
    return (new BigNumber(number)).dividedBy((new BigNumber(10).pow(18))).toFixed(2);
}