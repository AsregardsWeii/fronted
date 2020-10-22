/**
 * @author 杨金刚
 * @date 2020/4/23 13:30
 */

export function compare(propertyName, type) {
    if(type === "asc"){
        return function(obj1,obj2) {
            let v1 = obj1[propertyName];
            let v2 = obj2[propertyName];
            if(v2 < v1) {
                return 1;
            }
            else if(v2 > v1) {
                return -1;
            }
            else {
                return 0;
            }
        }
    }else if(type === "desc"){
        return function(obj1,obj2) {
            let v1 = obj1[propertyName];
            let v2 = obj2[propertyName];
            if(v2 > v1) {
                return 1;
            }
            else if(v2 < v1) {
                return -1;
            }
            else {
                return 0;
            }
        }
    }
}