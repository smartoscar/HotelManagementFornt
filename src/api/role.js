// 定义操作角色的api函数，实现增删改查

// 导入请求函数
import { $get, $post } from "@/utils/request"
// 导入消息框
import { $msg_s, $msg_e } from '../utils/msg.js'

// 返回所有的
export let roleList = async() => {
    let data = await $get('Role/list')
    return data
}

// 添加角色信息
export let roleAdd = async(params) => {
    // 表单校验
    if (!checkInput(params, false)) {
        return false
    }
    let r = await $_post('Role/add', params)
    return r
}

// 修改角色信息
export let roleEdit = async(params) => {
    // 表单校验
    if (!checkInput(params, true)) {
        return false
    }
    let r = await $_post('Role/edit', params)
    return r
}

// 删除角色信息
export let roleDelete = async(id) => {
    if (!id) {
        $msg_e("id不能为空")
        return false
    }
    let r = await $_post('/Role/delete/' + id)
    return r
}

// 获取角色权限
export let rolePermissionList = async(id) => {
    let r = await $get('Role/rolePermissionList/' + id)
    if (r.status == 1) {
        $msg_s(r.msg)
    }
    return r
}

// 修改角色权限
export let editRolePermission = async(params, roleId) => {
    let r = await $post('Role/editRolePermission/' + roleId, params)
    return r
}

// post请求封装
let $_post = async(url, params) => {
    let data = await $post(url, params)
    data.status == 0 ? $msg_s(data.msg) : $msg_e(data.msg)
    return data.status == 0
}

// 表单验证
let checkInput = (params, eidtMode) => {
    if (eidtMode && !params.id) {
        $msg_e('角色ID不存在')
        return false
    } else if (!params.roleName) {
        $msg_e('请输入角色名称')
        return false
    }
    return true
}