import {useTranslation} from "@app/core";

export function useClientTranslation(signature: string,target:string='admin') {
    return useTranslation(`${target}@client:${signature}`);
}
