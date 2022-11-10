// 客房接口API

// 导入请求函数
import { $get, $post } from "@/utils/request"
// 导入消息框
import { $msg_s, $msg_e, $confirm } from '../utils/msg.js'

// 分页查询
export let listRoom = async(params) => {
    let r = await $get('Room/list', params)
    return r
}

// 根据房型查询所有客房不分页
export let listRoomNoPage = async(roomTypeId) => {
    let r = await $get('Room/list/' + roomTypeId)
    return r
}

// 根据ID查询单个客房信息
export let oneRoomByCode = async(roomCode) => {
    let r = await $get('Room/one/' + roomCode)
    return r
}

// 增加客房
export let addRoom = async(params) => {
    if (!checkInput(params)) {
        return false
    }
    let r = await $post('Room/add', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 修改
export let editRoom = async(params) => {
    if (!checkInput(params)) {
        return false
    }
    let r = await $post('Room/edit', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 删除
export let deleteRoom = async(id) => {
    let r = await $post('Room/delete/' + id)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 停用启用
export let enableRoom = async(id) => {
    let r = await $get('Room/enableRoom/' + id)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 获取房间照片
export let listRoomImg = async(id) => {
    let r = await $get('Room/listRoomImg/' + id)
    return r
}

// 上传照片成功后更新数据
export let addRoomImg = async(params) => {
    let r = await $post('Room/addRoomImg', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 删除图片
export let deleteRoomImg = async(id) => {
    let r = await $get('Room/deleteRoomImg/' + id)
    return r.status == 0
}

let checkInput = (params) => {
    if (!params.name || params.name == '') {
        $msg_e('房间名称不能为空')
        return false
    } else if (!params.price || params.price == '') {
        $msg_e('价格不能为空')
        return false
    } else if (isNaN(parseFloat(params.price))) {
        $msg_e('价格只能为数字')
        return false
    } else if (!params.status || params.status == 0) {
        $msg_e('请选择房间状态')
        return false
    } else if (!params.roomTypeId || params.status == 0) {
        $msg_e('请选择房型')
        return false
    }
    return true
}