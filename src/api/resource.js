// 定义操作权限的api函数，实现增删改查

// 导入请求函数
import { $get, $post } from "@/utils/request"
// 导入消息框
import { $msg_s, $msg_e, $confirm } from '../utils/msg.js'

// 返回所有的
export let resourceList = async(id) => {
    let data = await $post('resource/list/' + id)
    return data
}

// 添加
export let resourceAdd = async(params) => {
    // 表单校验
    if (!checkInput(params, false)) {
        return false
    }
    let r = await $_post('resource/add', params)
    return r
}

// 修改
export let resourceEdit = async(params) => {
    // 表单校验
    if (!checkInput(params, true)) {
        return false
    }
    let r = await $_post('resource/edit', params)
    return r
}

// 删除
export let resourceDelete = async(id) => {
    await $confirm('是否删除数据')
    if (!id) {
        $msg_e("id不能为空")
        return false
    }
    let r = await $_post('resource/delete/' + id)
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
        $msg_e('ID不存在')
        return false
    } else if (!params.title) {
        $msg_e('请输入标题')
        return false
    } else if (!params.href) {
        $msg_e('请输入链接')
        return false
    } else if (!params.permissionCode) {
        $msg_e('请输入权限码')
        return false
    }
    return true
}