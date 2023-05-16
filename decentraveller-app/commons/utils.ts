const withTimeout = async (promiseToExecute: () => Promise<any>, timeoutInMillis: number, taskName: string) => {
    return Promise.race([
        promiseToExecute(),
        new Promise((_, reject) => {
            setTimeout(() => {
                console.log(`${taskName} has timeouted.`)
                reject(new Error('Timeout when doing operation'));
            }, timeoutInMillis);
        }),
    ]);
};

export { withTimeout };
