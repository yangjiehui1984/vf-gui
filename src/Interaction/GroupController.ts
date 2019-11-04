import { UIBase } from "../core/UIBase";

/**
 * 
 * @private
 */
export const _GroupObject = new Map<string, { [key: string]: UIBase }>();

/** 
 * 注册分组，
 */
export function registrerGroup(ui: UIBase) {
    if ( ui.groupName) {

        let group = _GroupObject.get( ui.groupName);
        if (!group) {
            group = {};
            _GroupObject.set( ui.groupName, group);
        }
        group[ui.uuid] = ui;
    }
}

/**
 * 注销指定分组或指定分组的子项
 */
export function unRegistrerGroup(ui: UIBase) {
    if (ui.groupName) {
        const group = _GroupObject.get(ui.groupName);
        if (group) {
            delete group[ui.uuid];
        }
        let isKey = false;
        for (const key in group) {
            isKey = true;
            break;
        }
        if (isKey) {
            _GroupObject.delete(ui.groupName);
        }
    }
}

/** 设置选中 */
export function getGroup(name?: string): { [key: string]: UIBase } | undefined {
    if (name == undefined) {
        return undefined;
    }
    return _GroupObject.get(name);
}
