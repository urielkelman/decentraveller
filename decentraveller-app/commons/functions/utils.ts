const withTimeout = async <T>(promiseToExecute: () => Promise<T>, timeoutInMillis: number, taskName: string) => {
    return Promise.race([
        promiseToExecute(),
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout for task ${taskName}.`));
            }, timeoutInMillis);
        }),
    ]);
};

const obfuscateAddress = (address) => {
    const prefix = '0x';
    const start = address.slice(0, 4);
    const end = address.slice(-4);
    return `${prefix}${start}...${end}`;
};

const formatString = (str, vars) => str.replace(/{(.*?)}/g, (_, name) => vars[name]);

const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export { withTimeout, obfuscateAddress, formatString, sleep };
