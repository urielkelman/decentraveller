const withTimeout = async (promiseToExecute: () => Promise<any>, timeoutInMillis: number, taskName: string) => {
    return Promise.race([
        promiseToExecute(),
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout for task ${taskName}.`));
            }, timeoutInMillis);
        }),
    ]);
};

export { withTimeout };
