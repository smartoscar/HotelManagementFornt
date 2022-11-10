// 房型获取接口API

// 导入请求函数
import { $get, $post } from "@/utils/request"
// 导入消息框
import { $msg_s, $msg_e, $confirm } from '../utils/msg.js'

// 房型查询
export let listRoomType = async() => {
    let r = await $get('RoomType/list')
    return r
}

// 已启用房型查询
export let listRoomTypeForEnable = async() => {
    let r = await $get('RoomType/listEnable')
    return r
}


// 房型增加
export let addRoomType = async(params) => {
    if (!checkInput(params)) {
        return false
    }
    let r = await $post('RoomType/add', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 房型修改
export let editRoomType = async(params) => {
    if (!checkInput(params)) {
        return false
    }
    let r = await $post('RoomType/edit', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 房型删除
export let deleteRoomType = async(id) => {
    let r = await $post('RoomType/delete/' + id)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 房型启用停用
export let enableRoomType = async(id) => {
    let r = await $post('RoomType/enable/' + id)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

let checkInput = (params) => {
    if (!params.name || params.name == '') {
        $msg_e('房型名称不能为空')
        return false
    } else
    if (!params.bedNum || params.bedNum == '') {
        $msg_e('床位数不能为空')
        return false
    } else if (isNaN(parseInt(params.bedNum))) {
        $msg_e('床位数只能为整数')
        return false
    } else if (!params.price || params.price == '') {
        $msg_e('价格不能为空')
        return false
    } else if (isNaN(parseFloat(params.price))) {
        $msg_e('价格只能为数字')
        return false
    }
    return true
}