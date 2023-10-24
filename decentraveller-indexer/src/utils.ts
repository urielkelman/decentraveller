const formatString = (str: string, vars: { [x: string]: any }) =>
    str.replace(/{(.*?)}/g, (_: any, name: string | number) => vars[name]);

export { formatString };
