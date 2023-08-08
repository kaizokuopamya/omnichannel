export class SideNavData{
    ID: string;
    JSON_KEY:string; 
    Status:string;
    URL: string;
    imageName: string
    isEnable: string;
    menuName: string;
    rights: string;
    sequenceNo: string;
    textToDisplay: string;
    type: string;
    subMenu?:SubMenu[];
} 

export class SubMenu{
    appid?: number | string;
    createdby?: number | string;
    createdon?: number | string;
    enabled?: string;
    id?:number | string;
    jsonkey?: string;
    menuid?: number | string;
    menuimage?: string;
    menulogo?: string;
    pageurl?:string;
    rights?:string;
    seqdisplay?: number | string;
    statusid?:number | string;
    submenuname?: string
    texttodisplay?:string;
}