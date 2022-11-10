// 判断是否有权限

export let $checkPermission = (permissionCode, userPermission) => {
    let result = false
    if (userPermission) {
        userPermission.some(ele => {
            if (ele.permissionCode == permissionCode || $checkPermission(permissionCode, ele.childrenResource)) {
                result = true;
                return true
            }
        })
    }
    return result;
}