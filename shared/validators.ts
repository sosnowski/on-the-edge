export const isValidDomain = (domain: string) => {
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/;
    return domainRegex.test(domain);
};
